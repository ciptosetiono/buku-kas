import { Controller, Get, Query, UseGuards, Req, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';
import { ReportSummaryQueryDto } from './dto/report-summary-query.dto';
import { Request } from 'express';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}


    @Get('cashbook')
    async getCashbookReport(
        @Query() query: ReportSummaryQueryDto,
    ) {

        const {fromDate, toDate } = this.reportsService.parseDateQuery(query.fromDate, query.toDate);

        return this.reportsService.getCashbookReport(fromDate, toDate, query.account);
    }   

    @Get('monthly')
    async getMonthlyTrend(
      @Req() req: Request,
      @Query('months', new ParseIntPipe({ optional: true })) months = 12,
      @Query() query: ReportSummaryQueryDto,
    ) {

        const {fromDate, toDate } = this.reportsService.parseDateQuery(query.fromDate, query.toDate);
        return this.reportsService.getMonthlyTrend(months, fromDate, toDate, query.account);
    }

    @Get('category-breakdown')
    async getCategoryBreakdown(
        @Req() req: Request,
        @Query() query: ReportSummaryQueryDto,
        @Query('type') type: string,
    ) {
        const {fromDate, toDate } = this.reportsService.parseDateQuery(query.fromDate, query.toDate);

        return this.reportsService.getCategoryBreakdown(fromDate, toDate, query.account, type);
    }
    

}
