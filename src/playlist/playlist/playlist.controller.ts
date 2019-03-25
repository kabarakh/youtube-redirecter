import { Controller, Get, Res, Param, Req, Logger } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as FastifyUrlData from 'fastify-url-data';
import { ServerResponse } from 'http';
import { RedirectService } from './redirect.service';

@Controller('pl')
export class PlaylistController {
  constructor(private readonly redirectService: RedirectService) {}

  @Get()
  async goToPlaylists(@Res() response: FastifyReply<ServerResponse>) {
    const redirect = await this.redirectService.findBySourceUrlRecursively(
      '/pl',
    );
    response.redirect(301, redirect.targetUrl);
  }

  @Get('/:identifier')
  async goToPlaylist(
    @Param('identifier') identifier: string,
    @Res() response: FastifyReply<ServerResponse>,
  ) {
    const redirect = await this.redirectService.findBySourceUrlRecursively(
      `/${identifier}`,
    );
    response.redirect(301, redirect.targetUrl);
  }

  @Get('/:identifier/:videoNumber')
  async goToVideo(
    @Param('identifier') identifier: string,
    @Param('videoNumber') videoNumber: string,
    @Res() response: FastifyReply<ServerResponse>,
  ) {
    const redirect = await this.redirectService.findBySourceUrlRecursively(
      `/${identifier}`,
    );
    response.redirect(301, `${redirect.targetUrl}&index=${videoNumber}`);
  }
}
