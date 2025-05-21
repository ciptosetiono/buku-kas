import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { Transfer, TransferSchema } from './schemas/transfer.schema';
import { Account, AccountSchema } from '../accounts/schemas/account.schema';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema';
import { CategoriesService } from '../categories/categories.service';
import { Category, CategorySchema } from '../categories/schemas/category.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transfer.name, schema: TransferSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Category.name, schema: CategorySchema }
    ])
  ],
  controllers: [TransfersController],
  providers: [TransfersService, CategoriesService],
})
export class TransfersModule {}
