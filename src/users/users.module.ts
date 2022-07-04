import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SwipeModule } from 'src/swipe/swipe.module';
import { SwipeService } from 'src/swipe/swipe.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [SwipeModule,TypeOrmModule.forFeature([User]),
  MulterModule.register({})
],
  controllers: [UsersController],
  providers: [UsersService,SwipeService]
})
export class UsersModule {}