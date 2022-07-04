import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyBasicStrategy } from 'src/auth/security/strategies/my-basic.strategy';
import { SwipeModule } from 'src/swipe/swipe.module';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { MyBearerStrategy } from './security/strategies/my-bearer.strategy';
import { TokenController } from './token/token.controller';

@Module({
  controllers: [TokenController],
  providers: [UsersService, MyBasicStrategy, MyBearerStrategy],
  imports: [
    PassportModule,
    SwipeModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET||"MyDigitalSchool Lyon cest top",
      signOptions: {
        audience: process.env.JWT_AUDIENCE||"localhost:3000"
      },
    }),
    TypeOrmModule.forFeature([User])
  ],
})
export class AuthModule {}

