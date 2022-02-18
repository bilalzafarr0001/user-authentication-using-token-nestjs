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

@Controller('/api/v1/user')
export class UserController {
  constructor(
    private readonly userServerice: UserService,
    private readonly jwtService: JwtService,
  ) {}
  @Post('/signup')
  async Signup(@Res() response, @Body() userdet: User) {
    const { accessToken, user } = await this.userServerice.signup(
      userdet,
      this.jwtService,
    );
    return response.status(HttpStatus.CREATED).json({
      accessToken,
      user,
    });
  }

  @Post('/signin')
  async SignIn(
    @Req() request: Request,
    @Res() response,
    @Body() userdet: User,
  ) {
    const { accessToken, user } = await this.userServerice.signin(
      userdet,
      this.jwtService,
    );

    // const myToken = await this.userServerice.verifytoken(
    //   accessToken,
    //   this.jwtService,
    // );
    console.log('req.headers', request.headers.authorization);
    return response.status(HttpStatus.OK).json({ accessToken, user });
  }

  @Post('/verify-token')
  async VerifyToken(
    @Req() request: Request,
    @Res() response,
    @Body() getToken: string,
  ) {
    console.log(
      'headers in controller verify token is  :',
      request.headers.authorization,
    );

    const gettoken = request.headers.authorization;
    const extractToken = gettoken.slice(7);
    console.log('GET_TOKEN from headers ', extractToken);
    const myToken = await this.userServerice.verifytoken(
      extractToken,
      this.jwtService,
    );

    return response.status(HttpStatus.OK).json(myToken);
  }

  @Get('/users')
  async getAllUsers(@Res() response) {
    const users = await this.userServerice.getAll();
    return response.status(HttpStatus.OK).json({
      users: users.users,
    });
  }
}
