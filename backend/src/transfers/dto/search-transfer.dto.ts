import { IsOptional, IsString } from "class-validator";

export class SearchTransferDto {
    @IsOptional()
    @IsString()
    note?:string;

    @IsOptional()
    @IsString()
    accountFrom?:string;

    @IsOptional()
    @IsString()
    accountTo?:string;

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