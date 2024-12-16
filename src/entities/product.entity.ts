import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ProductStatus } from "src/enums/product-status.enum";
import { CategoryEntity } from "./category.entity";

@Entity('products')
export class ProductEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Expose()
    @ApiProperty()
    name: string;

    @Column()
    @Expose()
    @ApiProperty()
    price: number;

    @Column()
    @Expose()
    @ApiProperty()
    qty: number;

    @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
    @Expose()
    @ApiProperty()
    status: ProductStatus;

    @Column({ type: 'date' })
    @Expose()
    @ApiProperty()
    expDate: Date;

    @Column()
    @Expose()
    @ApiProperty()
    imageUrl: string;

    @ManyToOne(() => CategoryEntity)
    @JoinColumn({ name: 'categoryId' })
    @ApiProperty()
    category: CategoryEntity;
}