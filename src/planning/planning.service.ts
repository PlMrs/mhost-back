import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { Planning } from './entities/planning.entity';

@Injectable()
export class PlanningService {
    constructor(@InjectRepository(Planning) private data: Repository<Planning>){}

    findAllWithIds(user_1: number,user_2:number): Promise<Planning[]>{
        return this.data.find({where:[
            {by: user_1,isValidated: true},
            {by: user_2,isValidated: true},
            {with: user_1, isValidated: true},
            {with: user_2, isValidated: true},
        ]})
    }

    create(dto: CreatePlanningDto): Promise<Planning>{
        return this.data.save(dto)
    }
}
