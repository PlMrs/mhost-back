import { Swipe } from "src/swipe/entities/swipe.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity,  JoinColumn,  ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Messages {
    
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    match_id : number

    @Column()
    from : User

    @Column()
    message : string;

    
    @ManyToOne(()=> Swipe, swipe => swipe.id, {onDelete: "CASCADE"})
    @JoinColumn({name: "match_id"})
    matchid!: Swipe

    @ManyToOne(()=> User, user => user.id, {onDelete: "CASCADE"})
    @JoinColumn({name: "from"})
    user_1id!: User

}
