const mongoose = require('mongoose');

const TBA_DESTINATIONSchema = new mongoose.Schema({
    DTN_ID: {
        type: String,
        unique: true,
        require: true,
    },
    DTN_DESTINATION: {
        type: String,
        require: true,
    }
}, {versionKey: false}, { _id : false });


mongoose.model('TBA_DESTINATION', TBA_DESTINATIONSchema);
