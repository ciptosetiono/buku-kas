import { Controller, Post, Body, Query, UseGuards, Request, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { SearchTransferDto } from './dto/search-transfer.dto';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { plainToInstance } from 'class-transformer';
@Controller('transfers')
@UseGuards(JwtAuthGuard)
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateTransferDto) {
    return this.transfersService.create(req.user.userId, dto);
  }
  @Get()
  findAll(@Query() query: any) {
      const { page, limit, ...searchParams } = query;

      const searchDto = plainToInstance(SearchTransferDto, searchParams);
      const paginationDto = plainToInstance(PaginationDto, { page, limit });

      return this.transfersService.findAll(searchDto, paginationDto);
  }
}
