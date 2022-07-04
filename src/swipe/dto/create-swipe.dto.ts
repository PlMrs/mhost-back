import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { User } from "src/users/entities/user.entity";

export class CreateSwipeDto {

    @ApiProperty()
    @IsNotEmpty()
    user_1!: User;

    @ApiProperty()
    @IsNotEmpty()
    user_2!: User;

}
