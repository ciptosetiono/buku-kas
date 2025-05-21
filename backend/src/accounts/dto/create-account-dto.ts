import { IsNotEmpty, IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;
}
