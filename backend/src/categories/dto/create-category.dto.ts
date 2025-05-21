import { IsNotEmpty, IsEnum, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';
}
