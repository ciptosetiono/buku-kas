import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transfer } from './schemas/transfer.schema';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { SearchTransferDto } from './dto/search-transfer.dto';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { Account } from '../accounts/schemas/account.schema';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class TransfersService {
  constructor(
    @InjectModel(Transfer.name) private transferModel: Model<Transfer>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private readonly categoryService: CategoriesService
  ) {}

  async create(userId: string, dto: CreateTransferDto) {
    const { fromAccount, toAccount, amount, date, note } = dto;

    if (fromAccount === toAccount) {
      throw new BadRequestException('Akun asal dan tujuan tidak boleh sama');
    }

    const fromAccountModel = await this.accountModel.findOne({ _id: fromAccount});
    const toAccountModel = await this.accountModel.findOne({ _id: toAccount});

    if (!fromAccountModel || !toAccountModel) {
      throw new NotFoundException('Akun tidak ditemukan');
    }

    if (fromAccountModel.balance < amount) {
      throw new BadRequestException('Saldo tidak cukup');
    }

    // Simpan transfer
    const transfer = await this.transferModel.create({ ...dto, userId });

    //Find Or create Transfer Out Category
    const transferOutCategory = await this.categoryService.findOrCreateCategory(userId, 'Transfer Out', 'expense');
    
    //Find Or Create Transfer In Category
    const transferInCategory = await this.categoryService.findOrCreateCategory(userId, 'Transfer In', 'income');

    
    // Simpan 2 transaksi otomatis
    await this.transactionModel.create([
      {
        account: fromAccount,
        category: transferOutCategory._id, 
        type: 'expense',
        amount,
        date,
        note: `Transfer to ${toAccountModel.name}`,
        user: userId
      },
      {
        account: toAccount,
        category: transferInCategory._id,
        type: 'income',
        amount,
        date,
        note: `Transfer from ${fromAccountModel.name}`,
        user: userId
      }
    ]);

    // Update saldo akun
    fromAccountModel.balance -= amount;
    toAccountModel.balance += amount;
    await fromAccountModel.save();
    await toAccountModel.save();

    return transfer;
  }

  async findAll(searchDto: SearchTransferDto, paginationDto: PaginationDto) {
      const filter: Record<string, any> = {};
  
      const {  page = 1, limit = 10 } = paginationDto;
  
      const skip = (Number(page) - 1) * Number(limit);
  
      Object.entries(searchDto).forEach(([key, value]) => {
        if (value) {
          if (key === 'fromDate' || key === 'toDate') {
            const dateValue = new Date(value);
            if (!isNaN(dateValue.getTime())) {
              filter.date = filter.date || {};
              if (key === 'toDate') {
                // Set time to end of day to include all results on that date
                dateValue.setHours(23, 59, 59, 999);
                filter.date['$lte'] = dateValue;
              } else {
                // fromDate: beginning of the day (default)
                filter.date['$gte'] = dateValue;
              }
  
              console.log('dateValue', dateValue);
            }
        } else {
           filter[key] = value;
          }
        }
      });
  
      const [ transfers, total ] = await Promise.all([
        this.transferModel.find(filter).sort({date: -1}).skip(skip).limit(limit).populate('fromAccount', 'name').populate('toAccount', 'name'),
        this.transferModel.countDocuments(filter),
      ]);
  
      return {
        data: transfers,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }


}
