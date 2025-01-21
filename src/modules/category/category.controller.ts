import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from 'src/entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get('/')
  async getAllCategory(): Promise<CategoryEntity[]> {
    return await this.categoryService.getAllCategory()
  }

  @Post('/')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    try {
      const newCategory = await this.categoryService.createCategory(createCategoryDto)
      return newCategory;
    } catch (error) {
      throw new HttpException(error.message || 'Internal Server Error', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteCategory(@Param() id: string): Promise<void> {
    try {
      return await this.categoryService.deleteCategory(id);
    } catch (error) {
      throw new HttpException(error.message || 'Internal Server Error', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
