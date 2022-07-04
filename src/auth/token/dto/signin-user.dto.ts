import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {

    @ApiProperty()
    access_token: string;

    @ApiProperty()
    grant_type: string = "password";

    @ApiProperty()
    expires_in:number | string;

    @ApiProperty()
    scope: string = "*";


}
