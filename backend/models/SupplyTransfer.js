const mongoose = require('mongoose');

const SupplyTransferSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InventoryItem',
        required: true
    },
    itemName: {
        type: String, // Stored to make querying easier if item is deleted
        required: true
    },
    sourceHospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    targetHospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
        default: 'Pending'
    },
    isAiRecommended: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('SupplyTransfer', SupplyTransferSchema);
