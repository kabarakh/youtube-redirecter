import mongoose from 'mongoose';

const logEntrySchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    triedUrl: String,
    result: String,
    referrer: String,
    status: String,
});

export interface LogEntryInterface extends mongoose.Document {
    date: Date;
    triedUrl: string;
    result: string;
    referrer: string;
    status: string;
}

const LogEntryConstants = {
    STATUS_FOUND: 'OK',
    STATUS_NOT_FOUND: 'Not Found',
};

export { LogEntryConstants };

export default mongoose.model<LogEntryInterface>('LogEntry', logEntrySchema);
