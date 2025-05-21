import { Controller,  UseGuards } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common/decorators';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(req.user.userId, dto);
  }

  @Get()
  findAll(
    @Query() searchDto: SearchCategoryDto,
    @Query() paginationDto: PaginationDto
  ) {
    return this.categoriesService.findAll(searchDto, paginationDto);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }


  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update( id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
