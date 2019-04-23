import { Controller, Get, Res, Param } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import { RedirectService } from './redirect.service';

@Controller('pl')
export class PlaylistController {
    /**
     * @param {RedirectService} redirectService
     */
    constructor(private readonly redirectService: RedirectService) {}

    /**
     * @param {FastifyReply<ServerResponse>} response
     */
    @Get()
    async goToPlaylists(@Res() response: FastifyReply<ServerResponse>) {
        this.redirectService.redirectBySourceUrl(`pl`, response);
    }

    /**
     * @param {string} identifier
     * @param {FastifyReply<ServerResponse>} response
     */
    @Get('/:identifier')
    async goToPlaylist(@Param('identifier') identifier: string, @Res() response: FastifyReply<ServerResponse>) {
        this.redirectService.redirectBySourceUrl(`pl/${identifier}`, response);
    }

    /**
     * @param {string} identifier
     * @param {number} videoNumber
     * @param {FastifyReply<ServerResponse>} response
     */
    @Get('/:identifier/:videoNumber')
    async goToVideo(
        @Param('identifier') identifier: string,
        @Param('videoNumber') videoNumber: number,
        @Res() response: FastifyReply<ServerResponse>,
    ) {
        this.redirectService.redirectBySourceUrlAndVideoIndex(`pl/${identifier}`, videoNumber, response);
    }
}
