import { Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { ProductStatus } from "src/enums/product-status.enum";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    price: string;

    @IsString()
    qty: string;

    @IsEnum(ProductStatus)
    @IsOptional()
    status?: ProductStatus;

    @IsString()
    categoryId: string;

    @Type(() => Date)
    @IsDate()
    expDate: Date;
}
