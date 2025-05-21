import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Account, AccountDocument } from './schemas/account.schema';
import { CreateAccountDto } from './dto/create-account-dto';
import { UpdateAccountDto } from './dto/update-account-dto';
import { SearchAccountDto } from './dto/search-account-dto';
import { PaginationDto } from '../common/dto/pagination-dto';

import { BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class AccountsService {
  constructor(@InjectModel(Account.name) private accountModel: Model<Account>) {}

  async create(userId: string, dto: CreateAccountDto) {
    return this.accountModel.create({ ...dto, userId });
  }

  async findAll(userId: string, searchDto: SearchAccountDto, paginationDto: PaginationDto) {
    
    const { keyword } = searchDto;
    const {  page = 1, limit = 10 } = paginationDto;

    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};

    if(keyword){
      filter.name = { $regex: keyword, $options: 'i' }
    }


    const [accounts, total] = await Promise.all([
      this.accountModel.find(filter).skip(skip).limit(limit),
      this.accountModel.countDocuments(filter),
    ]);

    return {
      data: accounts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(userId: string, id: string) {

    if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid account ID format');
    }

    const account = await this.accountModel.findOne({ _id: id, userId });

    if(!account) {
        throw new NotFoundException('Account not found');
    }

    return account;
  }

  async update(userId: string, id: string, dto: UpdateAccountDto) {

    if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid account ID format');
    }

    const account = await this.accountModel.findOneAndUpdate(
      { _id: id},
      dto,
      { new: true },
    );

    if (!account) {
        throw new NotFoundException('Account not found');
    }

    return account;

  }

  async remove(userId: string, id: string) {
    if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid account ID format');
    }

    const deleted = await this.accountModel.findOneAndDelete({ _id: id });

    if (!deleted) {
        throw new NotFoundException('Account not found or not owned by user');
    }
      
    return { message: 'Account deleted successfully' };
  }
}
