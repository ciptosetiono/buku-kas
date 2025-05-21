import { IsNotEmpty, IsMongoId, IsNumber, IsPositive, IsEnum, IsOptional, IsDateString } from 'class-validator';

export class CreateTransactionDto {
  @IsMongoId()
  @IsNotEmpty()
  account: string;

  @IsMongoId()
  @IsNotEmpty()
  category: string;

  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsDateString()
  date: string;

  @IsOptional()
  note?: string;
}