import { Controller, Get, Res, Req } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import { RedirectService } from './playlist/playlist/redirect.service';

@Controller()
export class AppController {
    /**
     * @param {RedirectService} redirectService
     */
    constructor(private readonly redirectService: RedirectService) {}

    /**
     * @param {FastifyReply<ServerResponse>} response
     */
    @Get()
    async goToChannel(@Res() response: FastifyReply<ServerResponse>) {
        this.redirectService.redirectBySourceUrl('/', response);
    }
}
