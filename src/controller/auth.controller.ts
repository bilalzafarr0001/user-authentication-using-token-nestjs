import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { User } from '../model/user.schema';
import { UserService } from '../service/user.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly userServerice: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/login')
  async login(@Res() response, @Body() userdet: User) {
    const { accessToken, user } = await this.userServerice.login(
      userdet,
      this.jwtService,
    );
    return response.status(HttpStatus.CREATED).json({
      accessToken,
      user,
    });
  }

  @Post('/register')
  async register(@Res() response, @Body() userdet: User) {
    const { accessToken, user } = await this.userServerice.register(
      userdet,
      this.jwtService,
    );

    return response.status(HttpStatus.OK).json({ accessToken, user });
  }

  @Post('/verify-token')
  async verifyToken(@Req() request: Request, @Res() response) {
    const gettoken = request.headers.authorization;
    const extractToken = gettoken.slice(7);

    const myToken = await this.userServerice.verifyToken(
      extractToken,
      this.jwtService,
    );

    return response.status(HttpStatus.OK).json(myToken);
  }
}
