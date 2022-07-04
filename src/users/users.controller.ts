import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, Headers, UseInterceptors, UploadedFile, UploadedFiles, StreamableFile, Response, Query, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/auth/security/roles.guard';
import { Roles } from 'src/auth/security/roles.decorator';
import { User, UserRole } from './entities/user.entity';
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SwipeService } from 'src/swipe/swipe.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream, existsSync, mkdirSync } from 'fs';
import { JwtService } from '@nestjs/jwt';
import { Verified } from 'src/auth/security/verified.decorator';

const jwts = new JwtService({secret : process.env.JWT_SECRET})

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly swipeService: SwipeService
    ) {}

  @ApiOperation({description: "Ajout d'un utilisateur en base de donnée"})
  @ApiCreatedResponse({
    description: "Utilisateur ajouté avec succès",
    type: User,
  })
  //Ajout d'un utilisateur en base de donnée
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    
    //Recherche de l'utilisateur grâce à son email
    const exist = await this.usersService.findByEmail(dto.email)

    //Si l'adresse e-mail est déjà prise, on arrête l'opération
    if(exist){
      throw new HttpException('User already exist',HttpStatus.UNAUTHORIZED)
    }

    //Ajout de l'utilisateur en base de donnée
    return this.usersService.create(dto);
  }


  @ApiOperation({description: "Liste de tous les utilisateurs"})
  @ApiOkResponse({
    description: "Tous les utilisateurs",
    type: [User],
  })
  //Authentification par Jwt
  @UseGuards(RolesGuard)
  //Qui peut avoir accès à la route
  @Roles(UserRole.ADMIN)
  //Liste de tous les utilisateurs
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @Get('swipe')
  async findNotSwiped(@Request() req: any,@Headers('needs') needs: string): Promise<User[]> {

    const {id} = req.user;

    const user_ids = await this.swipeService.findUsersMatched(id);

    return this.usersService.findNotSwiped(id,needs,user_ids);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @Get('match')
  async findMatched(@Request() req: any): Promise<User[]>{

      const {id} : any = req.user

      const ids = await this.swipeService.findUsersMatched(id)

      return this.usersService.findAllWithIds(ids)

  }


  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @ApiOperation({description: "Modifie un utilisateur grace à son id"})
  @ApiNotFoundResponse({ description: "L'utilisateur n'a pas été trouvé"})
  @ApiOkResponse({
    description: "L'utilisateur patché",
    type: User,
  })
  @Patch(':id')
  update(@Param('id') id: number,@Request() req: any,@Body() updateUserDto: UpdateUserDto) {

    const {id : token_id} = req.user

    if(Number(id) === token_id){
      return this.usersService.update(+id, updateUserDto);
    }
    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('verified/:id')
  validateUser(@Param('id') id : number,@Body() updateUserDto: UpdateUserDto){
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: (req,file,callback)=>{
      if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
    storage : diskStorage({
      destination : '../front/assets/images/users/picture',
      filename : (req,file,callback) => {
        const splited = file.originalname.split('.')
        const ext = splited[splited.length - 1]
        callback(null, `${uuidv4()}.${ext}`);
      }
    })
  }))
  async uploadFile(@Request() req: any,@UploadedFile() file: Express.Multer.File) {

    const {id} = req.user;

    const user = await this.usersService.findOne(id)

    const dto : UpdateUserDto = {picture : file.filename}
    const res = await this.usersService.update(id,dto)

    if(res.affected === 1){
      this.usersService.deletePicture(user.picture)

      return file.filename
    }
  }

  @ApiOperation({description: "Supprime un utilisateur grace à son id"})
  @ApiNotFoundResponse({ description: "L'utilisateur n'a pas été trouvé"})
  @ApiOkResponse({description: "L'utilisateur a été supprimé"})
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete()
  async adminRemove(@Body() user: User): Promise<HttpStatus> {
    this.usersService.remove(user)
    this.usersService.deletePicture(user.picture)
    return HttpStatus.OK
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @Verified(false)
  @Post('uploadVerifications')
  @UseInterceptors(FileFieldsInterceptor([
      {name: "carte_id", maxCount: 1},
      {name: "certificatScolaire", maxCount: 1}
    ],
    {
      fileFilter: (req,file,callback)=>{
        if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|JPG|JPEG|PNG|PDF)$/)) {
          return callback(new Error('Only image files and pdf are allowed!'), false);
        }
        callback(null, true);
      },
      storage : diskStorage({
        destination : (req,file,callback)=>{
          const {id : user_id}: any = jwts.decode(req.headers.authorization.split(' ')[1])
          const dest = `../server-storage/${user_id}`
          const destExist = existsSync(dest)
          if(!destExist){
            mkdirSync(dest)
          }
          return callback(null, dest)
        },
        filename : (req,file,callback) => {
          const {id : user_id}: any = jwts.decode(req.headers.authorization.split(' ')[1])
          const splited = file.originalname.split('.')
          const ext = splited[splited.length - 1]
          callback(null, `${user_id}-${file.fieldname}.${ext}`);
      }})
    }
  ))
  async postVerifiedFiles(@Request() req: any,@UploadedFiles() files: { carte_id: Express.Multer.File[], certificatScolaire : Express.Multer.File[]   } ){
    
    const {id} = req.user

    const dto : UpdateUserDto = {carte_id : files.carte_id[0].filename, certificatScolaire : files.certificatScolaire[0].filename}
    return this.usersService.update(id,dto)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('verifications')
  getNotVerifiedUsers(): Promise<User[]>{
   return  this.usersService.findNotVerified()
  }

  
  @Get('files')
  returnUserFile(@Response({ passthrough: true }) res,@Query('bearer') token : string, @Query('user_id') id: number,@Query('filename') filename : string ){
    let jwt : any;
    try{
      jwt = jwts.verify(token, {secret : process.env.JWT_SECRET})
    }catch(e){
      return 'token invalide'
    }
    if(jwt.role === "A"){
      const file = createReadStream(`../server-storage/${id}/${filename}`);
      res.set({
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="'+ filename + '"',
      });
      return new StreamableFile(file);
    }else{
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
  }
}
