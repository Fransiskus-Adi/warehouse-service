import { Expose, Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class ProductDataDto {
    @Expose()
    @IsString()
    id: string;

    @Expose()
    @IsString()
    name: string;

    @Expose()
    @IsNumber()
    price: number;

    @Expose()
    @IsNumber()
    qty: number;

    @Expose()
    @IsString()
    status: string;

    @Expose()
    @Type(() => Date)
    @IsDate()
    expDate: Date;

    @Expose()
    @IsString()
    imageUrl: string;

    @Expose()
    @IsString()
    categoryId: string;
}