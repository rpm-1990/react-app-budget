const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    budget: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^#[0-9A-Fa-f]{6}$/.test(value);
            },
            message: "Only pass hexa decimal values for the colors ",
        },
    },
}, { collection: 'budgetData' });

module.exports = mongoose.model('budgetData', budgetSchema);
