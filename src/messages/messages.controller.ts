import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/security/roles.decorator';
import { RolesGuard } from 'src/auth/security/roles.guard';
import { UserRole } from 'src/users/entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Messages } from './entities/messages.entity';
import { MessagesService } from './messages.service';

@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @Get()
  findMessages(@Headers("match_id") id : number): Promise<Messages[]>{
    return this.messagesService.findAllWithId(id)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @Post()
  createMessage(@Body() dto: CreateMessageDto): Promise<Messages>{
    return this.messagesService.create(dto)
  }
}
