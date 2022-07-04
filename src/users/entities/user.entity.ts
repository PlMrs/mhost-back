import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Swipe } from "src/swipe/entities/swipe.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {ADMIN="A",CUSTOMER="C"}
export enum UserNeeds {TRAVEL="T", HOST="H",DISCUTE="D"}

@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    @OneToMany(()=> Swipe, swipe => swipe.user_1)
    @OneToMany(()=> Swipe, swipe => swipe.user_2)
    id!: number;

    @ApiProperty()
    @Column({length: 100})
    name!: string;

    @ApiProperty()
    @Column({length:100})
    surname!: string;

    @ApiProperty()
    @Column({length:300})
    email!: string;

    @Exclude()
    @Column({length: 255})
    password !: string;

    @ApiProperty({enum: UserRole})
    @Column({type:"enum", enum:UserRole, default: UserRole.CUSTOMER} )
    role!: UserRole;

    @Column({type:"enum", enum:UserNeeds, default: UserNeeds.DISCUTE})
    needs?: UserNeeds;
    
    @Column({default: "default.jpg"})
    picture?: string;

    @Column({length: 255, nullable: true})
    description?: string;

    @Column({nullable : true})
    carte_id ?: string

    @Column({nullable : true})
    certificatScolaire ?: string

    @Column({default: false})
    verified: boolean;
}
