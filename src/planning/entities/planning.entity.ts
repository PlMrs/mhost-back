import { User } from "src/users/entities/user.entity";
import { Column, Entity,  JoinColumn,  ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Planning {
    
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    by : User

    @Column()
    with : User

    @Column()
    start : Date;

    @Column()
    end : Date;

    @Column({default: false})
    isValidated : Boolean;

    @ManyToOne(()=> User, user => user.id,{onDelete: "CASCADE"})
    @JoinColumn({name: "by"})
    by_id!: User

    @ManyToOne(()=> User, user => user.id, {onDelete: "CASCADE"})
    @JoinColumn({name: "with"})
    with_id!: User

}
