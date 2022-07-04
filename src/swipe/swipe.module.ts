import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Swipe } from './entities/swipe.entity';
import { SwipeController } from './swipe.controller';
import { SwipeService } from './swipe.service';

@Module({
    imports: [TypeOrmModule.forFeature([Swipe])],
    exports: [TypeOrmModule],
    controllers: [SwipeController],
    providers: [SwipeService]
})
export class SwipeModule {}
