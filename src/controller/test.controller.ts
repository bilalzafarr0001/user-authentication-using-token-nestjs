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
import { Request } from 'express';

@Controller('/')
export class TestController {
  constructor() {}

  @Get('/test')
  async test(@Res() response) {
    return response.status(HttpStatus.OK).json({
      message: 'Test route',
    });
  }
}
