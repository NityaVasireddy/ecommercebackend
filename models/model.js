const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema({

    idea: {
        type: String,
        required: true,
        trim: true
    },

    teamSize: {
        type: Number,
        required: true,
        min: 1,
        max: 6
    },

    domain: {
        type: String,
        enum: ["web", "ai", "iot", "mobile", "other"],
        default: "other"
    },

    selected: {
        type: Boolean,
        default: false
    },

    submittedOn: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Idea", ideaSchema);