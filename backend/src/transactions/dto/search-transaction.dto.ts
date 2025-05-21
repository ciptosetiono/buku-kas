import { IsOptional, IsString } from "class-validator";

export class SearchTransactionDto {
    @IsOptional()
    @IsString()
    note?:string;

    @IsOptional()
    @IsString()
    account?:string;

    @IsOptional()
    @IsString()
    category?:string;

    @IsOptional()
    @IsString()
    type:string;

    @IsOptional()
    @IsString()
    amount:number;

    @IsOptional()
    @IsString()
    fromDate?: string;

    @IsOptional()
    @IsString()
    toDate?: string;
}