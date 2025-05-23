import { IsOptional, IsString } from "class-validator";

export class SearchUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    email?: string;
}