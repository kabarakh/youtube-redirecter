import {
  Controller,
  Get,
  Response,
  Logger,
  Param,
  Request,
} from '@nestjs/common';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { RedirectService } from './redirect.service';
import { throws } from 'assert';

@Controller('pl')
export class PlaylistController {
  constructor(private readonly redirectService: RedirectService) {}

  @Get()
  goToPlaylists(@Response() response: ExpressResponse) {
    response.redirect(301, 'https://www.youtube.com/user/kabarakh/playlists/');
  }

  @Get('/:shortcut')
  async goToPlaylist(
    @Request() request: ExpressRequest,
    @Param('shortcut') shortcut: string,
  ) {
    const targetRedirect = await this.redirectService.findBySourceUrl(
      request.url,
    );
    if (targetRedirect) {
      return `Redirecting from ${request.url} to ${
        targetRedirect.targetUrl
      } - parameter ${shortcut}`;
    } else {
      this.goToPlaylist(request, shortcut.replace(/(.+)(\/[^\/]+)/, '$1'));
    }
  }
}
