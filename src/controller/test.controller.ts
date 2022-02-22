import { Controller, Get, HttpStatus, Res } from '@nestjs/common';

@Controller('/')
export class TestController {
  constructor() {}

  @Get('/test')
  async test(@Res() response) {
    return response.status(HttpStatus.OK).json({
      message: 'Test  1233',
    });
  }
}
