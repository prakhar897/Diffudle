var mongoose = require('mongoose');

const User = mongoose.model('user', new mongoose.Schema({
    IPAddress: String,
    AttemptNumber: {
        type: Map,
        of: String,
        default: {}
    },
    Success: {
        type: Map,
        of: Boolean,
        default: {}
    },
    CurrentVisiblePositions: [Number]
}));


module.exports = User

