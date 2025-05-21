import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { AccountsModule } from 'src/accounts/accounts.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    AccountsModule,
    CategoriesModule,
    UsersModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [MongooseModule], 
})
export class TransactionsModule {}
