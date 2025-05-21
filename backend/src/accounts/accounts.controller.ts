import { Controller,  UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account-dto';
import { UpdateAccountDto } from './dto/update-account-dto';
import { Body, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common/';
import { SearchAccountDto } from './dto/search-account-dto';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

    @Post()
    create(@Req() req, @Body() dto: CreateAccountDto) {
        return this.accountsService.create(req.user.userId, dto);
    }

    @Get()
    findAll(
        @Req() req,
        @Query() searchDto: SearchAccountDto,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.accountsService.findAll(req.user.userId, searchDto, paginationDto);
    }

    @Get(':id')
    findOne(@Req() req, @Param('id') id: string) {
        return this.accountsService.findOne(req.user.userId, id);
    }

    @Put(':id')
    update(@Req() req, @Param('id') id: string, @Body() dto: UpdateAccountDto) {
        return this.accountsService.update(req.user.userId, id, dto);
    }

    @Delete(':id')
    remove(@Req() req, @Param('id') id: string) {
        return this.accountsService.remove(req.user.userId, id);
    }
}
