import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDataDto } from './dto/userDataDto.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async getAllUser(): Promise<UserDataDto[]> {
    const allUserData = await this.userRepository.find();
    allUserData.map(user => plainToClass(UserDataDto, user))
    return allUserData;
  }

  async getUserByEmail(email: string): Promise<UserDataDto> {
    return await this.userRepository.findOne({ where: { email } })
  }

  async getUserById(id: string): Promise<UserDataDto> {
    return await this.userRepository.findOne(id);
  }
}
