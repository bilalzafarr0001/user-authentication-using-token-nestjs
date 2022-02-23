import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { User } from '../model/user.schema';
import { AuthService } from '../service/auth.service';
import { Request } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Res() response, @Body() userDto: User) {
    const { accessToken, user, message } = await this.authService.login(
      userDto,
    );
    if (message) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message,
      });
    }

    return response.status(HttpStatus.OK).json({
      accessToken,
      user,
    });
  }

  @Post('/register')
  async register(@Res() response, @Body() userDto: User) {
    const { accessToken, user, message } = await this.authService.register(
      userDto,
    );
    if (message) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message,
      });
    }

    return response.status(HttpStatus.CREATED).json({ accessToken, user });
  }

  @Post('/verify-token')
  async verifyToken(@Req() request: Request, @Res() response) {
    const gettoken = request.headers.authorization;
    const extractToken = gettoken.slice(7);

    const myToken = await this.authService.verifyToken(extractToken);

    return response.status(HttpStatus.OK).json(myToken);
  }
}
