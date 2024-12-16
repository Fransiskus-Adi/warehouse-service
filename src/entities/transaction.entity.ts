import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "./user.entity";
import { TransactionStatus } from "src/enums/transaction-status.enum";
import { TransactionItemEntity } from "./transactionItem.entity";

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Expose()
    @Column()
    @ApiProperty()
    customerName: string;

    @Expose()
    @Column()
    @ApiProperty()
    customerPhone: string;

    @Expose()
    @Column()
    @ApiProperty()
    transactionCode: string;

    @Expose()
    @Column()
    @ApiProperty()
    transactionPlatform: string;

    @Column()
    @Expose()
    @ApiProperty()
    totalItem: number;

    @Expose()
    @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.ONGOING })
    @ApiProperty()
    status: TransactionStatus;

    @Column()
    @Expose()
    @ApiProperty()
    subTotal: number;

    @Column()
    @Expose()
    @ApiProperty()
    totalPrice: number;

    @Column({ type: 'date' })
    @Expose()
    @ApiProperty()
    transactionDate: Date;

    @ManyToOne(() => UserEntity, user => user.transactions)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @OneToMany(() => TransactionItemEntity, transactionItem => transactionItem.order, {
        cascade: ["insert"]
    })
    transactionItem: TransactionItemEntity[];
}