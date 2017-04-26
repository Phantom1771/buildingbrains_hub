const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    link: { type: String, unique: true },
    state: String,
    type: String,
    }, {timestamps: true });

module.exports = mongoose.model('UnregDevice', schema);


