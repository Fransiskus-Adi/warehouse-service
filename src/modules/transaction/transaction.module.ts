import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { TransactionItemEntity } from 'src/entities/transactionItem.entity';
import { ProductEntity } from 'src/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionEntity,
      TransactionItemEntity,
      ProductEntity
    ])
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule { }
