import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDataDto } from './dto/userDataDto.dto';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Get('/')
  async getAllUser(): Promise<UserDataDto[]> {
    return await this.userService.getAllUser();
  }

  @Get('/:id')
  async getUserById(@Param() id?: string): Promise<UserDataDto> {
    return await this.userService.getUserById(id)
  }

  @Get('/search')
  async getUserByEmail(@Query('email') email?: string): Promise<UserEntity> {
    return await this.userService.getUserByEmail(email);
  }

  @Post('/')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.createUser(createUserDto)
      return newUser;
      // return null;
    } catch (error) {
      throw new HttpException(error.message || 'Internal Server Error', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    try {
      return await this.userService.deleteUser(id);
    } catch (error) {
      throw new HttpException(error.message || 'Internal Server Error', error.status || HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Patch(":id")
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDataDto> {
    return await this.userService.updateUser(id, updateUserDto);
  }
}
