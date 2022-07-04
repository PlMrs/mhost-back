import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty } from "class-validator";
import { User } from "src/users/entities/user.entity";

export class CreatePlanningDto {

    @ApiProperty()
    @IsNotEmpty()
    by !: User;

    @ApiProperty()
    @IsNotEmpty()
    with !: User;

    @ApiProperty()
    @IsNotEmpty()
    start !: Date;

    @ApiProperty()
    @IsNotEmpty()
    end !: Date;

}
