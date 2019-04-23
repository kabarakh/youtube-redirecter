import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import { Connection, Repository } from 'typeorm';
import { Redirect } from '../redirect.entity';
import { YoutubeResult } from '../youtube-result.interface';

@Injectable()
export class RedirectService {
    /**
     * @param {Connection} connection
     * @param {Repository<Redirect>} redirectRepository
     * @param {HttpService} httpService
     */
    constructor(
        private readonly connection: Connection,
        @InjectRepository(Redirect) private readonly redirectRepository: Repository<Redirect>,
        private readonly httpService: HttpService,
    ) {}

    /**
     * @param {string} url
     * @returns {Promise<Redirect>}
     */
    async findBySourceUrlRecursively(url: string): Promise<Redirect> {
        let redirect: Redirect;
        if (url === '/' || url === '') {
            redirect = await Promise.resolve({
                id: 'some_id',
                sourceUrl: '/',
                targetPlaylistId: '##channel##',
            });
        } else {
            redirect = await this.redirectRepository.findOne({
                sourceUrl: url,
            });
        }
        if (!redirect) {
            const newUrl = url.includes('/') ? url.replace(/(.*)(\/[^\/]*)$/, '$1') : '';
            redirect = await this.findBySourceUrlRecursively(newUrl);
        }
        return redirect;
    }

    /**
     * @returns {Promise<Redirect[]>}
     */
    async loadAll(): Promise<Redirect[]> {
        return await this.redirectRepository.find();
    }

    /**
     * @param {string} url
     * @param {FastifyReply<ServerResponse>} response
     * @returns {void}
     */
    redirectBySourceUrl(url: string, response: FastifyReply<ServerResponse>): void {
        const redirectPromise = this.findBySourceUrlRecursively(url);
        response.headers({
            'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: 'Sun, 08 Mar 1987 19:00:00 GMT',
        });
        redirectPromise
            .then((redirect: Redirect) => {
                return this.generateYoutubeUrl(redirect);
            })
            .then((redirectUrl: string) => {
                response.redirect(301, redirectUrl);
            });
    }

    /**
     * @param {string} url
     * @param {number} videoIndex
     * @param {FastifyReply<ServerResponse>} response
     * @returns {void}
     */
    redirectBySourceUrlAndVideoIndex(url: string, videoIndex: number, response: FastifyReply<ServerResponse>): void {
        const redirectPromise = this.findBySourceUrlRecursively(url);
        response.headers({
            'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: 'Sun, 08 Mar 1987 19:00:00 GMT',
        });

        redirectPromise
            .then((redirect: Redirect) => {
                return this.generateYoutubeUrl(redirect, videoIndex);
            })
            .then((redirectUrl: string) => {
                response.redirect(301, redirectUrl);
            });
    }

    /**
     * @protected
     * @param {Redirect} redirect
     * @param {number} [videoIndex=-1]
     * @returns {Promise<string>}
     */
    protected async generateYoutubeUrl(redirect: Redirect, videoIndex: number = 0): Promise<string> {
        if (redirect.targetPlaylistId === '##channel##') {
            return 'https://www.youtube.com/user/kabarakh';
        } else if (redirect.targetPlaylistId === '##playlists##') {
            return 'https://www.youtube.com/user/kabarakh/playlists';
        }

        if (videoIndex > 0) {
            const videoId = await this.getVideoId(redirect.targetPlaylistId, videoIndex);
            return `https://www.youtube.com/watch?v=${videoId}&list=${redirect.targetPlaylistId}`;
        } else {
            return Promise.resolve(`https://www.youtube.com/playlist?list=${redirect.targetPlaylistId}`);
        }
    }

    /**
     * @protected
     * @param {string} playlistId
     * @param {number} videoIndex
     * @returns {Promise<string>}
     */
    protected async getVideoId(playlistId: string, videoIndex: number): Promise<string> {
        let totalEntries = 0;
        videoIndex = videoIndex - 1;

        let youtubePlaylistDataResponse: AxiosResponse<YoutubeResult> = await this.httpService
            .get(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}`,
            )
            .toPromise();

        const youtubePlaylistData = youtubePlaylistDataResponse.data;
        totalEntries = youtubePlaylistData.pageInfo.totalResults;
        while (videoIndex > youtubePlaylistData.items.length && youtubePlaylistData.items.length < totalEntries) {
            youtubePlaylistDataResponse = await this.httpService
                .get(
                    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${
                        youtubePlaylistData.nextPageToken
                    }&key=${apiKey}`,
                )
                .toPromise();

            youtubePlaylistData.items = youtubePlaylistData.items.concat(youtubePlaylistDataResponse.data.items);
            youtubePlaylistData.nextPageToken = youtubePlaylistDataResponse.data.nextPageToken;
        }

        if (videoIndex <= youtubePlaylistData.items.length) {
            return youtubePlaylistData.items.slice(videoIndex, videoIndex + 1).pop().snippet.resourceId.videoId;
        } else {
            return youtubePlaylistData.items.slice(-1).pop().snippet.resourceId.videoId;
        }
    }
}
