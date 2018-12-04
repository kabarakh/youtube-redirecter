import { config } from 'dotenv';

config();

export interface ConfigObject {
    port: number;
    channelUrl: string;
    db: {
        username: string;
        password: string;
        database: string;
        server: string;
        port: number;
    };
    debug: boolean;
}

export default {
    port: parseInt(process.env.WEBSERVER_PORT || '', 10),

    channelUrl: process.env.FALLBACK_URL || '',

    db: {
        username: process.env.DB_USERNAME || '',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DBNAME || '',
        server: process.env.DB_HOSTNAME || '',
        port: parseInt(process.env.DB_PORT || '', 10),
    },

    debug: process.env.LOG_DEBUG === 'true',
};
