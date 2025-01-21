import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ProductStatus } from 'src/enums/product-status.enum';
import { Type } from 'class-transformer';

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    price?: string;

    @IsString()
    @IsOptional()
    qty?: string;

    @IsEnum(ProductStatus)
    @IsOptional()
    status?: ProductStatus;

    @IsString()
    @IsOptional()
    categoryId?: string;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    expDate?: Date;
}
