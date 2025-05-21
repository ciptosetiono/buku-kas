import { IsOptional, IsString, IsEnum} from "class-validator";

export class SearchCategoryDto {

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  type?: 'income' | 'expense';
}