import { Controller, Get, Response, Logger, Request } from '@nestjs/common';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';

@Controller()
export class AppController {
  @Get()
  goToChannel(
    @Response() response: ExpressResponse,
    @Request() request: ExpressRequest,
  ) {
    Logger.log(request.url);
    response.redirect(301, 'https://www.youtube.com/user/kabarakh/');
  }
}
