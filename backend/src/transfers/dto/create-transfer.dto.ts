import { IsMongoId, IsNotEmpty, IsPositive, IsDateString, IsOptional } from 'class-validator';

export class CreateTransferDto {
  @IsMongoId()
  @IsNotEmpty()
  fromAccount: string;

  @IsMongoId()
  @IsNotEmpty()
  toAccount: string;

  @IsNotEmpty()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsOptional()
  note?: string;
}
