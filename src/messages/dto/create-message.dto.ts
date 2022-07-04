import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty } from "class-validator";
import { User } from "src/users/entities/user.entity";

export class CreateMessageDto {

    @ApiProperty()
    @IsNotEmpty()
    match_id !: number;

    @ApiProperty()
    @IsNotEmpty()
    from !: User;

    @ApiProperty()
    @IsNotEmpty()
    message !: string;

}
