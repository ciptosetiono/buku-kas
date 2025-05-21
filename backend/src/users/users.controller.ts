import { Controller, Get, Post, Put, Delete, Body, UseGuards, Req, Query, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(
    @Query() searchDto: SearchUserDto,
    @Query() paginationDto: PaginationDto,
  ){
    return this.usersService.findAll(searchDto, paginationDto);
  }

  @Post('create')
  async create(
    @Body() createUserDto : CreateUserDto,
  ) {
    return await this.usersService.create(createUserDto);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto
  ) {
      return await this.usersService.update(id, dto);
  }

  @Put('update-password/:id')
  updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto
  ) {
    return this.usersService.updatePassword(id, dto);
  }

  @Delete(':id')
  async delete(
     @Param('id') id: string,
  ){
     return await this.usersService.remove(id);
  }

  @Get('me')
  getProfile(@Req() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Put('update-profile')
  updateProfile(
    @Req() req,
    @Body() dto: UpdateUserDto
  ) {
    return this.usersService.update(req.user.userId, dto);
  }


  
}
