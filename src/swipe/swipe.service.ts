import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { threadId } from 'worker_threads';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { Swipe } from './entities/swipe.entity';
import { User } from 'src/users/entities/user.entity';
import { UpdateSwipeDto } from './dto/update-swipe.dto';

@Injectable()
export class SwipeService {
    constructor(@InjectRepository(Swipe) private data: Repository<Swipe>){}

    create(createSwipeDto : CreateSwipeDto) : Promise<Swipe>{
        return this.data.save(createSwipeDto);
    }

    findOne(id: number) : Promise<Swipe>{
        return this.data.findOne(id)
    }

    async findIdWithUsers(user_1,user_2): Promise<number>{
      const res = await this.data.findOne({where :[
                      {user_1 : user_1, user_2 : user_2},
                      {user_1 : user_2, user_2 : user_1}
                  ]})
      if(res){
        return res.id
      }
      throw new NotFoundException()
    }

    checkSwipe(user_1 : User, user_2: User) : Promise<Swipe>{
        return this.data.findOne({where :[
            {user_1 : user_1, user_2 : user_2},
            {user_1 : user_2, user_2 : user_1}
        ]})
    }

    async findUsersMatched(id: number): Promise<Array<number>> {
        const usersId = await this.data.find({
            select : ["user_1","user_2"],
            where : [
              {user_1 : id},
              {user_2 : id, isMatched:true},
            ]
          })
    
          let ids = []
    
          usersId.forEach(e=>{
            if(Number(e.user_1) != id){
              ids.push(e.user_1)
            }
            if(Number(e.user_2) != id){
              ids.push(e.user_2)
            }
          })
    
        return ids
    }

    async update(id:number, dto: UpdateSwipeDto): Promise<Swipe>{
        let done = await this.data.update(id, dto);
        if (done.affected != 1)
            throw new NotFoundException(id)

        return this.findOne(id);
    }
}
