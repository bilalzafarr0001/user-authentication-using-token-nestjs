import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../model/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(userDet: User, jwt: JwtService): Promise<any> {
    const foundUser = await this.userModel
      .findOne({ email: userDet.email })
      .exec();
    if (foundUser) {
      return {
        message: 'User Email Already Exists!',
      };
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(userDet.password, salt);
    const reqBody = {
      username: userDet.username,
      email: userDet.email,
      password: hash,
    };
    const newUser = new this.userModel(reqBody);
    console.log('User in register ', newUser);
    newUser.save();
    const payload = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };
    const { email, username, id, createdDate } = newUser;
    const user = { email, username, id, createdDate };
    return {
      accessToken: jwt.sign(payload),
      user: user,
    };
  }

  async login(userDet: User, jwt: JwtService): Promise<any> {
    const foundUser = await this.userModel
      .findOne({ email: userDet.email })
      .exec();
    if (foundUser) {
      const { password } = foundUser;
      if (bcrypt.compare(userDet.password, password)) {
        const payload = {
          id: foundUser._id,
          username: foundUser.username,
          email: foundUser.email,
        };
        const { email, username, id, createdDate } = foundUser;
        const user = { email, username, id, createdDate };
        console.log('User in login ', user);
        return {
          accessToken: jwt.sign(payload),
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

  async verifyToken(token: string, jwt: JwtService): Promise<any> {
    return {
      myToken: jwt.decode(token),
    };
  }

  async getAll(): Promise<any> {
    const allUsers = await this.userModel.find();

    return {
      users: allUsers,
    };
  }

  async getById(id): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async update(id, user: User): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id): Promise<any> {
    return await this.userModel.findByIdAndRemove(id);
  }
}
