import mongoose from 'mongoose';
import url from 'url';

import Logger from '../Utility/Logger';
import Config from './Config';

class DatabaseConnection {

    public connect = (): Promise<mongoose.Mongoose> => {

        const dbConfig = Config.db;

        const urlObject = {
            protocol: 'mongodb',
            slashes: true,
            auth: dbConfig.username + ':' + dbConfig.password,
            hostname: dbConfig.server,
            port: dbConfig.port,
            pathname: dbConfig.database,
        };

        const mongoUrl = url.format(urlObject);

        Logger.debug('connecting to db ' + mongoUrl);

        return mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
        });
    }
}

export default new DatabaseConnection();
