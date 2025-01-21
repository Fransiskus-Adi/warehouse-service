import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, UseInterceptors, BadRequestException, UploadedFile, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { multerConfig } from 'src/config/multer-config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductDataDto } from './dto/product-data.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }
  @Get('/')
  async getAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keyword') keyword?: string,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: string | ''
  ): Promise<{
    data: ProductDataDto[],
    metadata: {
      totalCount: number, currentPage: number, totalPages: number
    }
  }> {
    try {
      return await this.productService.getAllProducts(page, limit, keyword, categoryId, status)
    } catch (error) {
      throw new HttpException(error.message || 'Internal Server Error', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('imageUrl', multerConfig))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() imageFile: Express.Multer.File
  ) {
    try {
      if (!imageFile) {
        throw new BadRequestException("Image file was missing.")
      }
      const newProduct = await this.productService.createProduct(createProductDto, imageFile.filename)
      return newProduct;
    } catch (error) {
      throw new HttpException(error.message || 'Internal Server Error', error.status || HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<{ data: ProductDataDto }> {
    const productData = await this.productService.getProductById(id);
    return productData;
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<any> {
    return await this.productService.deleteProduct(id)
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageUrl', multerConfig))
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() imageFile?: Express.Multer.File
  ): Promise<ProductEntity> {
    try {
      const imageUrl = imageFile ? imageFile.filename : '';
      console.log(updateProductDto)
      return await this.productService.updateProduct(id, updateProductDto, imageUrl);
    } catch (error) {
      throw new HttpException(error.message || 'Internal Server Error', error.status || HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
