const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: { type: String,unique : true, required: true },
    mobileNumber: { type: String, required: true },
    profilePicPath: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
