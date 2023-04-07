const mongoose = require("mongoose");

const SecureSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    airportodepart: {
        type: String,
        required: true,
    },
    airportoarrival: {
        type: String,
        required: true,
    },
});

module.exports = new mongoose.model("QRcode", SecureSchema);