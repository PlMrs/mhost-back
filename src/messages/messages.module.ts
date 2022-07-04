import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Messages } from './entities/messages.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Messages])],
  controllers: [MessagesController],
  providers: [MessagesService]
})
export class MessagesModule {}
