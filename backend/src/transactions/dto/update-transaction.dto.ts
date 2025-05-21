// src/transactions/dto/update-transaction.dto.ts
import {
    IsOptional,
    IsMongoId,
    IsString,
    IsEnum,
    IsNumber,
    IsDateString,
  } from 'class-validator';
  import { TransactionType } from '../schemas/transaction.schema';
  
  export class UpdateTransactionDto {
    @IsOptional()
    @IsEnum(TransactionType)
    type?: TransactionType;
  
    @IsOptional()
    @IsMongoId()
    account?: string;
  
    @IsOptional()
    @IsMongoId()
    category?: string;
  
    @IsOptional()
    @IsNumber()
    amount?: number;
  
    @IsOptional()
    @IsDateString()
    date?: string;
  
    @IsOptional()
    @IsString()
    note?: string;
  }
  