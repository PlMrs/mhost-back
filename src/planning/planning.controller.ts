import { Body, Controller, Get, Headers, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/security/roles.decorator';
import { RolesGuard } from 'src/auth/security/roles.guard';
import { Verified } from 'src/auth/security/verified.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { Planning } from './entities/planning.entity';
import { PlanningService } from './planning.service';

@Controller('planning')
export class PlanningController {
    constructor(private readonly planningService: PlanningService) {}

    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
    @Get()
    findAllWithIds(@Headers("user_1") user_1: number,@Headers("user_2") user_2: number): Promise<Planning[]>{
       return this.planningService.findAllWithIds(user_1,user_2)
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
    @Verified()
    @Post()
    async create(@Body() dto: CreatePlanningDto): Promise<HttpStatus>{
        
        const res = await this.planningService.create(dto)
        if(res){
            return HttpStatus.CREATED
        }
    }
}
