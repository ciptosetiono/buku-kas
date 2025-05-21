import { Controller,  UseGuards } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Put,  Query, Req } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { SearchTransactionDto } from './dto/search-transaction.dto';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { plainToInstance } from 'class-transformer';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Query() query: any) {
      const { page, limit, ...searchParams } = query;

      const searchDto = plainToInstance(SearchTransactionDto, searchParams);
      const paginationDto = plainToInstance(PaginationDto, { page, limit });

      return this.transactionsService.findAll(searchDto, paginationDto);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.transactionsService.update( id, req.user.userId, dto);
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.transactionsService.delete(id);
  }
}
