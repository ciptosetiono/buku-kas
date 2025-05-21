import { IsOptional, IsDateString, IsString } from 'class-validator';

export class ReportSummaryQueryDto {

  @IsOptional()
  @IsString()
  account?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: Date;

  @IsOptional()
  @IsDateString()
  toDate?: Date;
}
