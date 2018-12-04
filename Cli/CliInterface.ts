import Redirect, { RedirectInterface } from '../Domain/Model/Redirect';
import RedirectRepository from '../Domain/Repository/RedirectRepository';
import Logger from '../Utility/Logger';

class CliInterface {
    public addRoute = (localRoute: string, remoteUrl: string) => {
        const urlSegments = this.splitAndSanitizeUrl(localRoute);

        const existingRoutePromise = RedirectRepository.findOneByUrlPartsNotRecursive(urlSegments);

        return existingRoutePromise.then((existingRoute: RedirectInterface) => {
            if (existingRoute === null) {
                const newRedirect = Redirect.create({
                    sourceUrl: urlSegments,
                    targetUrl: remoteUrl,
                });

                Logger.info(`Successfully added route ${localRoute} with target url ${remoteUrl}`);

                return newRedirect;
            } else {
                Logger.error(`Route ${localRoute} exists already with target ${existingRoute.targetUrl}`);
                return false;
            }
        });
    }

    public deleteRoute = (localRoute: string) => {
        const urlSegments = this.splitAndSanitizeUrl(localRoute);

        const existingRoutePromise = RedirectRepository.findOneByUrlPartsNotRecursive(urlSegments);

        return existingRoutePromise.then((existingRoute) => {
            if (existingRoute !== null) {
                const deleteResult = Redirect.deleteOne({
                    sourceUrl: urlSegments,
                });

                Logger.info(`Successfully deleted route ${localRoute}`);

                return deleteResult;
            } else {
                Logger.info(`Route ${localRoute} not found`);
                return false;
            }
        });
    }

    public listRoutes = () => {
        return Redirect
            .find()
            .exec();
    }

    protected splitAndSanitizeUrl = (url: string): string[] => {
        const urlSegments = url.split('/');
        if (urlSegments[0] === '') {
            urlSegments.shift();
        }
        return urlSegments;
    }

}

export default new CliInterface();
