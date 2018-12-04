import moment from 'moment';
import Config from '../Bootstrapping/Config';

class Logger {

    public info = (...args: any[]) => {
        this.log('INFO', ...args);
    }

    public error  = (...args: any[]) => {
        this.log('ERROR', ...args);
    }

    public debug = (...args: any[]) => {
        if (Config.debug) {
            this.log('DEBUG', ...args);
        }
    }

    public cliOutput = (...args: any[]) => {
        // tslint:disable-next-line:no-console
        console.log(...args);
    }

    protected log = (type: string, ...args: any[]) => {
        const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');

        if (type === 'ERROR') {
            // tslint:disable-next-line:no-console
            console.error(currentDateTime, '[' + type + ']', ...args);
        } else {
            // tslint:disable-next-line:no-console
            console.log(currentDateTime, '[' + type + ']', ...args);
        }
    }
}

export default new Logger();
