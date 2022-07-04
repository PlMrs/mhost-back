import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Messages } from './entities/messages.entity';

@Injectable()
export class MessagesService {
    constructor(@InjectRepository(Messages) private data: Repository<Messages>){}

    findAllWithId(id : number): Promise<Messages[]>{
        return this.data.find({where : {
            match_id : id
        }})
    }

    create(dto: CreateMessageDto): Promise<any>{
        return this.data.save(dto)
    }
}
