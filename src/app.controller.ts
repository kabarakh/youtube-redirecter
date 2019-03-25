import { Controller, Get, Res, Req } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ClientRequest, ServerResponse } from 'http';
import { RedirectService } from './playlist/playlist/redirect.service';

@Controller()
export class AppController {
  constructor(private readonly redirectService: RedirectService) {}

  @Get()
  async goToChannel(
    @Res() response: FastifyReply<ServerResponse>,
    @Req() request: FastifyRequest<ClientRequest>,
  ) {
    const redirect = await this.redirectService.findBySourceUrlRecursively('/');
    response.redirect(301, redirect.targetUrl);
  }
}
