import { Controller, Get, Res, Req } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ClientRequest, ServerResponse } from 'http';

@Controller()
export class AppController {
  @Get()
  goToChannel(
    @Res() response: FastifyReply<ServerResponse>,
    @Req() request: FastifyRequest<ClientRequest>,
  ) {
    response.redirect(301, 'https://www.youtube.com/user/kabarakh/');
  }
}
