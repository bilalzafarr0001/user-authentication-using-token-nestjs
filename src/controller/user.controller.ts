import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { User } from '../model/user.schema';
import { UserService } from '../service/user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAll(@Res() response) {
    const users = await this.userService.findAll();
    return response.status(HttpStatus.OK).json({
      users: users.users,
    });
  }

  @Get('/:id')
  async getById(@Res() response, @Param('id') id) {
    const user = await this.userService.findById(id);
    return response.status(HttpStatus.OK).json({
      user,
    });
  }

  @Post()
  async create(@Res() response, @Body() user: User) {
    const newUser = await this.userService.create(user);
    return response.status(HttpStatus.CREATED).json({
      newUser,
    });
  }

  @Put('/:id')
  async update(@Res() response, @Param('id') id, @Body() user: User) {
    const updatedUser = await this.userService.update(id, user);
    return response.status(HttpStatus.OK).json({
      updatedUser,
    });
  }

  @Delete('/:id')
  async delete(@Res() response, @Param('id') id) {
    const deletedUser = await this.userService.delete(id);
    return response.status(HttpStatus.OK).json({
      deletedUser,
    });
  }
}
