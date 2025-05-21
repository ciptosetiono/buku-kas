import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
