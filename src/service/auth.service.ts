import {
  Injectable,
  HttpException,
  HttpStatus,
  ConsoleLogger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../model/user.schema';
import { UserService } from '../service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  async register(userDto: User): Promise<any> {
    const foundUser = await this.userService.findByEmail(userDto.email);
    if (foundUser) {
      return {
        message: 'User Email Already Exists!',
      };
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(userDto.password, salt);
    let reqBody = new User();
    reqBody = {
      username: userDto.username,
      email: userDto.email,
      password: hash,
      createdDate: Date.now().toString(),
    };

    const newUser = await this.userService.create(reqBody);

    console.log('user', newUser);

    const payload = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };
    const { email, username, id, createdDate } = newUser;
    const user = { email, username, id, createdDate };

    return {
      accessToken: this.jwt.sign(payload),
      user: user,
    };
  }

  async login(userDto: User): Promise<any> {
    const foundUser = await this.userService.findByEmail(userDto.email);
    if (foundUser) {
      const { password } = foundUser;
      if (bcrypt.compare(userDto.password, password)) {
        const payload = {
          // id: foundUser._id,
          username: foundUser.username,
          email: foundUser.email,
        };
        const { email, username, createdDate } = foundUser;
        const user = { email, username, createdDate };
        console.log('User in login ', user);
        return {
          accessToken: this.jwt.sign(payload),
          user: user,
        };
      }
      return {
        message: 'Incorrect username or password',
      };
    }
    return new HttpException(
      'Incorrect username or password',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async verifyToken(token: string): Promise<any> {
    return {
      myToken: this.jwt.decode(token),
    };
  }
}
