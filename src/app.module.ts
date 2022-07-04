import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SwipeModule } from './swipe/swipe.module';
import { EventsGateway } from './gateway/events.gateway';
import { MessagesModule } from './messages/messages.module';
import { PlanningModule } from './planning/planning.module';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env'
  }),TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    synchronize: true
  }),UsersModule, AuthModule, SwipeModule, MessagesModule, PlanningModule],
  controllers: [AppController],
  providers: [EventsGateway],
})
export class AppModule {}
