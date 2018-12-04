import express from 'express';

import Config, {ConfigObject} from '../Bootstrapping/Config';
import Logger from '../Utility/Logger';
import RedirectRepository from '../Domain/Repository/RedirectRepository';

class Webserver {
    protected app: express.Application;
    protected config: ConfigObject;

    constructor() {
        this.app = express();
        this.config = Config as ConfigObject;
    }

    public startWebserver = () => {
        // todo: save referrer, input url and resulting url
        this.registerFaviconRoute();
        this.registerRobotsTxtRoute();

        this.app.get('*', (request, response) => {

            Logger.debug(request.url);
            const urlSegments = request.url.split('/');
            if (urlSegments[0] === '') {
                urlSegments.shift();
            }

            RedirectRepository.findOneByUrlParts(urlSegments).then((data) => {
                Logger.info(`found targetUrl ${data.targetUrl} for ${request.url}, redirecting user`);
                response.redirect(data.targetUrl);
            }, (reason: any) => {
                Logger.info('failure with url', request.url, ':', reason.toString());
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
