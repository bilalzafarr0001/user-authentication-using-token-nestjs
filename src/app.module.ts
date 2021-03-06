import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { secret } from './utils/constants';
import { join } from 'path/posix';
import { User, UserSchema } from './model/user.schema';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { TestController } from './controller/test.controller';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;
console.log(MONGO_URL);
@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URL),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AppController, UserController, TestController, AuthController],
  providers: [AppService, UserService, AuthService],
})
export class AppModule {}
