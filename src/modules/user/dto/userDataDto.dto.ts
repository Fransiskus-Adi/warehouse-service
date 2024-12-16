import { IsString } from "class-validator";

export class UserDataDto {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    role: string;
}