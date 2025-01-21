import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryEntity } from 'src/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) { }

  async getAllCategory(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find()
  }

  async getCategoryById(id: string): Promise<CategoryEntity> {
    return await this.categoryRepository.findOne(id);
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    try {
      const newCategory = await this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create new category.')
    }
  }

  async deleteCategory(id: string): Promise<any> {
    try {
      return await this.categoryRepository.softDelete(id);
    } catch (error) {
      throw new NotFoundException('Id not found!');
    }
  }
}
