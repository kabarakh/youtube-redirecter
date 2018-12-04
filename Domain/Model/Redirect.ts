import mongoose from 'mongoose';

const redirectSchema = new mongoose.Schema({
    sourceUrl: {
        type: [String],
        index: true,
    },
    targetUrl: String,
});

export interface RedirectInterface extends mongoose.Document {
    sourceUrl: string[];
    targetUrl: string;
}
export default mongoose.model<RedirectInterface>('Redirect', redirectSchema);
