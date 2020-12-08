const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    weight: {
        type: Number,
        default:1
    },
    date: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Report', reportSchema); 