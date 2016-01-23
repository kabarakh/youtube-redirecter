var mongoose = require('mongoose');
var redirectSchema = new mongoose.Schema({
    sourceUrl: {
        type: [String],
        index: true
    },
    targetUrl: String
});

module.exports = mongoose.model('Redirect', redirectSchema);
