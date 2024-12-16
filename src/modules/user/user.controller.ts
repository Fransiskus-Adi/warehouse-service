import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDataDto } from './dto/userDataDto.dto';

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
  async getUserByEmail(@Query('email') email?: string): Promise<UserDataDto> {
    return await this.userService.getUserByEmail(email);
  }
}
