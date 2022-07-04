import { Body, Controller, Get, Headers, HttpException, HttpStatus, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'src/auth/token/dto/signin-user.dto';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { User, UserRole } from 'src/users/entities/user.entity';
import { RolesGuard } from '../security/roles.guard';
import { Roles } from '../security/roles.decorator';
import { ConnexionDto } from './dto/connexion.dto';

@Controller('auth')
export class TokenController {
    constructor(
        private users: UsersService,
        private jwts: JwtService
    ){}

    @ApiOperation({description: "Authentifier un utilisateur"})
    @ApiUnauthorizedResponse({ description: "Authentification failed"})
    @ApiOkResponse({
        description: "Authentifié en tant qu'utilisateur",
        type: SignInDto
    })
    @ApiBody({ type: ConnexionDto, description : "email et mot de passe encodés en base64 ( email:password ). Ajouter le préfix Basic dans la requette exemple : Basic \"mon email:mdp encodé\""})
    @Post('/token')
    async signIn(@Body("Authorization") auth : string) {
        let args = auth && auth.split(" ");
        if(args && args.length == 2 && args[0] == "Basic") {
            const credentials = Buffer.from(args[1], "base64").toString("utf8").split(":");
            const email = credentials[0];
            const password = credentials[1];
            const user = await this.users.findByEmail(email);

            if(user && await bcrypt.compare(password, user.password)){
                const cr = new SignInDto();
                cr.grant_type = "password";
                cr.scope = "*";
                cr.expires_in = "1h";
                cr.access_token = await this.jwts.sign({
                    id: user.id,
                    role: user.role,
                    verified: user.verified
                },{
                    subject: user.email,
                    expiresIn: "1h"
                });
                return cr;
            }
            else{
                throw new HttpException('Connexion impossible, utilisateur ou mot de passe incorrect', HttpStatus.UNAUTHORIZED)
            }
        }
        throw new UnauthorizedException("Invalid or missing Basic credential ");
        
    }


  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.CUSTOMER)
  @Get('/session')
  async getSession(@Request() req: any): Promise<{user : User}>{

    const {id} = req.user
      
    try{

        const u = await this.users.findOne(id)

        return { user : u }

    }catch(e){
        return e
    }
      
  }

}