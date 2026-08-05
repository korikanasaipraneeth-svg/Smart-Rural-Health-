const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Medicine', 'Vaccine', 'Equipment', 'Oxygen', 'Supplies'],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    unit: {
        type: String,
        required: true // e.g. tablets, vials, cylinders
    },
    threshold: {
        type: Number,
        required: true,
        default: 10 // Alert when quantity falls below this
    },
    expiryDate: {
        type: Date
    },
    supplier: {
        type: String
    },
    dailyConsumptionRate: {
        type: Number,
        default: 0 // Estimated amount used per day
    },
    predictedDepletionDate: {
        type: Date // Calculated date when stock is expected to hit 0
    }
}, { timestamps: true });

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);
