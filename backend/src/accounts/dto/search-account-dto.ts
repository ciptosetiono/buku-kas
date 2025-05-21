import { IsOptional, IsString } from 'class-validator';

export class SearchAccountDto {

    @IsOptional()
    @IsString()
    keyword?: string;
}
