import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { TransactionEntity } from "./transaction.entity";

@Entity('users')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @Column()
    @ApiProperty()
    name: string;

    @Expose()
    @Column()
    @ApiProperty()
    email: string;

    @Column()
    @ApiProperty()
    password: string;

    @Expose()
    @Column()
    @ApiProperty()
    role: string;

    @OneToMany(() => TransactionEntity, transaction => transaction.user)
    transactions: TransactionEntity[];
}