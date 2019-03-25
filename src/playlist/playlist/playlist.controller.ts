import { Controller, Get, Res, Param, Req, Logger } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as FastifyUrlData from 'fastify-url-data';
import { ClientRequest, ServerResponse } from 'http';
import { RedirectService } from './redirect.service';

@Controller('pl')
export class PlaylistController {
  constructor(private readonly redirectService: RedirectService) {}

  @Get()
  goToPlaylists(@Res() response: FastifyReply<ServerResponse>) {
    response.redirect(301, 'https://www.youtube.com/user/kabarakh/playlists/');
  }

  @Get('*')
  async goToPlaylist(@Req() request: FastifyRequest<ClientRequest>) {
    Logger.log(request.urlData().path);
    const targetRedirect = await this.redirectService.findBySourceUrlRecursively(
      request.urlData().path,
    );
    return `Redirecting from ${request.urlData().path} to ${
      targetRedirect.targetUrl
    }`;
  }
}
