import { Messages } from "src/messages/entities/messages.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity,  JoinColumn,  ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Swipe {
    
    @PrimaryGeneratedColumn()
    @OneToMany(()=> Messages, message => message.match_id)
    id!: number;


    @Column()
    user_1 : User

    @Column()
    user_2 : User

    @ManyToOne(()=> User, user => user.id, {onDelete: "CASCADE"})
    @JoinColumn({name: "user_1"})
    user_1id!: User

    @ManyToOne(()=> User, user => user.id, {onDelete: "CASCADE"})
    @JoinColumn({name: "user_2"})
    user_2id!: User

    @Column({default: false})
    isMatched?: boolean;

}
