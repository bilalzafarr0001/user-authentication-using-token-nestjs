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
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
