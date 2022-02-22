import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { User } from '../model/user.schema';
import { UserService } from '../service/user.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { getModelToken } from '@nestjs/mongoose';

@Controller('/users')
export class UserController {
  constructor(
    private readonly userServerice: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('/')
  async getAllUsers(@Res() response) {
    const users = await this.userServerice.getAll();
    return response.status(HttpStatus.OK).json({
      users: users.users,
    });
  }
  @Get('/:id')
  async findById(@Res() response, @Param('id') id) {
    const user = await this.userServerice.getById(id);
    return response.status(HttpStatus.OK).json({
      user,
    });
  }

  @Post()
  async createUser(@Res() response, @Body() user: User) {
    const newUser = await this.userServerice.create(user);
    return response.status(HttpStatus.CREATED).json({
      newUser,
    });
  }

  @Put('/:id')
  async update(@Res() response, @Param('id') id, @Body() user: User) {
    const updatedUser = await this.userServerice.update(id, user);
    return response.status(HttpStatus.OK).json({
      updatedUser,
    });
  }

  @Delete('/:id')
  async delete(@Res() response, @Param('id') id) {
    const deletedUser = await this.userServerice.delete(id);
    return response.status(HttpStatus.OK).json({
      deletedUser,
    });
  }
}
