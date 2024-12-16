import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { TransactionEntity } from "./transaction.entity";
import { ProductEntity } from "./product.entity";

@Entity('transaction-items')
export class TransactionItemEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column()
    @Expose()
    @ApiProperty()
    qty: number;

    @Column()
    @Expose()
    @ApiProperty()
    price: number;

    @ManyToOne(() => TransactionEntity, transactionEntity => transactionEntity.transactionItem)
    @JoinColumn({ name: 'orderId' })
    order: TransactionEntity;

    @OneToOne(() => ProductEntity)
    @JoinColumn({ name: 'productId' })
    product: ProductEntity;
}