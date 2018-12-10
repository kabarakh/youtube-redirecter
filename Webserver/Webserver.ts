import express from 'express';

import Config, {ConfigObject} from '../Bootstrapping/Config';
import LogEntry, {LogEntryConstants, LogEntryInterface} from '../Domain/Model/LogEntry';
import RedirectRepository from '../Domain/Repository/RedirectRepository';
import Logger from '../Utility/Logger';

class Webserver {
    protected app: express.Application;
    protected config: ConfigObject;

    constructor() {
        this.app = express();
        this.config = Config as ConfigObject;
    }

    public startWebserver = () => {
        this.registerFaviconRoute();
        this.registerRobotsTxtRoute();

        this.app.get('*', (request, response) => {
            const logEntry = {
                triedUrl: request.url,
                referrer: request.get('Referrer'),
            } as LogEntryInterface;

            Logger.debug(request.url);
            const urlSegments = request.url.split('/');
            if (urlSegments[0] === '') {
                urlSegments.shift();
            }

            RedirectRepository.findOneByUrlParts(urlSegments).then((data) => {
                Logger.info(`found targetUrl ${data.targetUrl} for ${request.url}, redirecting user`);
                logEntry.status = LogEntryConstants.STATUS_NOT_FOUND;
                logEntry.result = data.targetUrl;

                LogEntry.create(logEntry);

                response.redirect(data.targetUrl);
            }, (reason: any) => {
                Logger.info('failure with url', request.url, ':', reason.toString());
                logEntry.status = LogEntryConstants.STATUS_NOT_FOUND;
                logEntry.result = Config.channelUrl;

                LogEntry.create(logEntry);

                this.redirectToChannelUrl(response);
            });

        });

        this.app.listen(Config.port, '127.0.0.1');
        Logger.info('Server started on http://127.0.0.1:' + Config.port);
    }

    protected redirectToChannelUrl = (response: express.Response) => {
        response.redirect(Config.channelUrl);
    }

    protected registerFaviconRoute = () => {
        this.app.get('/favicon.ico', (request, response) => {
            response.end();
        });
    }

    protected registerRobotsTxtRoute = () => {
        this.app.get('/robots.txt', (request, response) => {
            response.send('User-agent: *\nDisallow: /');
            response.end();
        });
    }

}

export default new Webserver();
