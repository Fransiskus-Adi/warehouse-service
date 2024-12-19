import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDataDto } from './dto/userDataDto.dto';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/createUserDto.dto';
import { hash, compare } from 'bcrypt'
import { UpdateUserDto } from './dto/updateUserDto.dto';

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

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } })
  }

  async getUserById(id: string): Promise<UserDataDto> {
    return await this.userRepository.findOne(id);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const validateExistingUser = await this.userRepository.findOne({
      where: {
        name: createUserDto.name
      }
    })
    if (validateExistingUser) {
      throw new BadRequestException("User already exist.")
    }

    const validateExistingEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    })
    if (validateExistingEmail) {
      throw new BadRequestException("Email already exist.")
    }

    try {
      const newUser = new UserEntity();
      newUser.name = createUserDto.name;
      newUser.email = createUserDto.email;
      // const hashPass = await hash(createUserDto.password);
      newUser.password = await hash(createUserDto.password, 10);
      newUser.role = createUserDto.role;
      return await this.userRepository.save(newUser);
      // return null
    } catch (error) {
      throw new InternalServerErrorException("Failed to create new user.")
    }
  }

  async deleteUser(id: string): Promise<any> {
    try {
      const userData = await this.userRepository.findOne(id);
      if (!userData) {
        throw new NotFoundException("Id was not found.")
      }
      return await this.userRepository.softDelete(id)
    } catch (error) {
      throw new InternalServerErrorException("Failed to delete user.")
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDataDto> {
    try {
      const userData = await this.userRepository.findOne(id);
      if (!userData) {
        throw new NotFoundException("User was not found.")
      }
      if (updateUserDto.name && updateUserDto.name != userData.name) {
        const validateName = await this.userRepository.findOne({ where: { name: updateUserDto.name } })
        if (validateName) {
          throw new BadRequestException("Name was already exist.")
        }
        userData.name = updateUserDto.name;
      }

      if (updateUserDto.email && updateUserDto.email != userData.email) {
        const validateEmail = await this.userRepository.findOne({ where: { email: updateUserDto.email } })
        if (validateEmail) {
          throw new BadRequestException("Email already exist.")
        }
        userData.email = updateUserDto.email;
      }

      if (updateUserDto.password) {
        userData.password = updateUserDto.password
      }

      userData.role = updateUserDto.role;

      return await this.userRepository.save(userData);
    } catch (error) {
      throw new InternalServerErrorException("Failed to update user.")
    }
  }
}
