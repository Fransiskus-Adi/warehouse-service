import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from 'src/entities/category.entity';
import { ProductDataDto } from './dto/product-data.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) { }

  async getAllProducts(
    page: number = 1,
    limit: number = 10,
    keyword?: string,
    categoryId?: string,
    status?: string | '',
  ): Promise<{
    data: ProductDataDto[],
    metadata: {
      totalCount: number, currentPage: number, totalPages: number
    }
  }> {
    const [data, totalCount] = await this.productRepository.findAndCount({
      relations: ['category'],
      take: limit,
      skip: (page - 1) * limit
    })
    const totalPages = Math.ceil(totalCount / limit)
    const tranformedData = data.map(product => {
      const productDto = plainToClass(ProductDataDto, product)
      const url = `${[process.env.IMAGE_URL]}`
      productDto.imageUrl = url + productDto.imageUrl;
      productDto.categoryId = product.category.id;
      return productDto;
    })

    return {
      data: tranformedData,
      metadata: {
        totalCount, currentPage: page, totalPages
      }
    }
  }

  async createProduct(
    createProductDto: CreateProductDto,
    imageFile: string | null,
  ): Promise<ProductEntity> {
    const validateExistingProduct = await this.productRepository.findOne({
      where: {
        name: createProductDto.name,
      }
    })
    if (validateExistingProduct) {
      throw new BadRequestException('Product already exist.')
    }

    const price = parseInt(createProductDto.price, 10)
    const qty = parseInt(createProductDto.qty, 10)

    try {
      const newProduct = new ProductEntity()
      newProduct.name = createProductDto.name;
      newProduct.price = price;
      newProduct.qty = qty;
      newProduct.status = createProductDto.status;
      newProduct.expDate = createProductDto.expDate;
      newProduct.category = new CategoryEntity();
      newProduct.category.id = createProductDto.categoryId;
      newProduct.imageUrl = imageFile;

      return await this.productRepository.save(newProduct);
    } catch (error) {
      throw new InternalServerErrorException("Failed to add new product.")
    }
  }

  async getProductById(id: string): Promise<{ data: ProductDataDto }> {
    const productData = await this.productRepository.findOne({
      where: { id },
      relations: ['category']
    })
    if (!productData) {
      throw new NotFoundException("Product not found.")
    }

    const productDataDto = new ProductDataDto();
    productDataDto.id = productData.id;
    productDataDto.name = productData.name;
    productDataDto.price = productData.price;
    productDataDto.qty = productData.qty;
    productDataDto.status = productData.status;
    productDataDto.expDate = productData.expDate;
    const url = `${process.env.IMAGE_URL}`
    productDataDto.imageUrl = url + productData.imageUrl;
    productDataDto.categoryId = productData.category.id;

    return { data: productDataDto }
  }

  async deleteProduct(id: string): Promise<any> {
    try {
      return await this.productRepository.softDelete(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete product.')
    }
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
    imageFile?: string | null
  ): Promise<ProductEntity> {
    try {
      const productData = await this.productRepository.findOne(id)
      if (!productData) {
        throw new NotFoundException('Product not found.')
      }

      const validateProductExist = await this.productRepository.findOne({
        where: {
          name: updateProductDto.name
        }
      })

      if (updateProductDto.name && updateProductDto.name !== productData.name) {
        if (validateProductExist) {
          throw new BadRequestException('Product already exists.')
        }
        productData.name = updateProductDto.name
      }

      if (updateProductDto.price) {
        const price = parseInt(updateProductDto.price, 10)
        if (isNaN(price) || price <= 0 || price > 100000000) {
          throw new BadRequestException('Invalid price.')
        }
        productData.price = price
      }

      if (updateProductDto.qty) {
        const qty = parseInt(updateProductDto.qty, 10)
        if (isNaN(qty) || qty <= 0 || qty > 1000) {
          throw new BadRequestException('Invalid price.')
        }
        productData.qty = qty;
      }

      productData.status = updateProductDto.status

      if (imageFile && imageFile !== productData.imageUrl) {
        productData.imageUrl = imageFile;
      }

      if (updateProductDto.categoryId) {
        productData.category = new CategoryEntity()
        if (updateProductDto.categoryId !== productData.category.id) {
          productData.category.id = updateProductDto.categoryId;
        }
      }

      if (updateProductDto.expDate) {
        if (updateProductDto.expDate !== productData.expDate) {
          productData.expDate = updateProductDto.expDate;
        }
      }

      return await this.productRepository.save(productData)
    } catch (error) {
      throw new InternalServerErrorException('Failed to update product.')
    }
  }
}
