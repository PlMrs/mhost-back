import { Controller, Post, Body, UseGuards, Get, Headers } from '@nestjs/common';
import { SwipeService } from './swipe.service'
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { Swipe } from './entities/swipe.entity';
import { UpdateSwipeDto } from './dto/update-swipe.dto';
import { RolesGuard } from 'src/auth/security/roles.guard';
import { Roles } from 'src/auth/security/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth } from '@nestjs/swagger';

const jwts = new JwtService({ secret: process.env.JWT_SECRET })

@ApiBearerAuth()
@Controller('swipe')
export class SwipeController {
    constructor(private readonly SwipeService: SwipeService) { }

    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
    @Post()
    async create(@Body() dto: CreateSwipeDto): Promise<Swipe> {

        const alreadySwiped = await this.SwipeService.checkSwipe(dto.user_1, dto.user_2)

        if (alreadySwiped && alreadySwiped.isMatched) {
            return
        }

        if (alreadySwiped) {
            return this.SwipeService.update(alreadySwiped.id, { isMatched: true })
        }

        return this.SwipeService.create(dto);

    }

    async update(id: number, dto: UpdateSwipeDto): Promise<Swipe> {
        return this.SwipeService.update(id, dto)
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
    @Get('id-with-users')
    findId(@Headers("Authorization") token: string, @Headers("user_2") user_2: number): Promise<number> {
        const { id: user_1 }: any = jwts.decode(token.split(' ')[1])
        return this.SwipeService.findIdWithUsers(user_1, user_2)
    }


}
