import mongoose, { DocumentQuery, Mongoose } from 'mongoose';
import q from 'q';

import Logger from '../../Utility/Logger';
import Redirect, { RedirectInterface } from '../Model/Redirect';

class RedirectRepository {

    public findOneByUrlPartsNotRecursive = (urlParts: string[]): q.IPromise<RedirectInterface> => {
        const deferred = q.defer() as q.Deferred<RedirectInterface>;

        Redirect.findOne({ sourceUrl: urlParts }, (error: mongoose.Error, redirect: RedirectInterface) => {
            if (error) {
                deferred.reject(error.toString());
            } else {
                deferred.resolve(redirect);
            }
        });

        return deferred.promise;
    }

    public findOneByUrlParts = (urlParts: string[]): Promise<RedirectInterface> => {
        const deferred = q.defer() as q.Deferred<RedirectInterface>;

        return this.resolveMongooseCall(urlParts, deferred);
    }

    protected resolveMongooseCall = (urlParts: string[], deferred: q.Deferred<RedirectInterface>): Promise<RedirectInterface> => {
        Logger.debug('trying repo findOneByUrlParts with ', urlParts.toString());

        Redirect
            .findOne(
                { sourceUrl: urlParts },
                (error: mongoose.Error, redirect: RedirectInterface) => {

                    if (error) {
                        deferred.reject(error.toString());
                    } else {
                        if (redirect === null) {
                            urlParts.pop();

                            if (urlParts.length === 0) {
                                deferred.reject('nothing found');
                            } else {
                                const intermediatePromise = this.resolveMongooseCall(urlParts, deferred);
                                intermediatePromise.then((intermediateRedirect: RedirectInterface) => {
                                    deferred.resolve(intermediateRedirect);
                                }, (reason: string) => {
                                    deferred.reject(reason);
                                });
                            }
                        } else {
                            deferred.resolve(redirect);
                        }
                    }
                });

        return deferred.promise;
    }
}

export default new RedirectRepository();
