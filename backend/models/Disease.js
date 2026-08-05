const mongoose = require('mongoose');

const DiseaseSchema = new mongoose.Schema({
    diseaseId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a disease name']
    },
    category: {
        type: String,
        required: true
    },
    symptoms: {
        type: String,
        required: true
    },
    riskLevel: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    contagious: {
        type: String,
        default: 'No'
    },
    seasonal: {
        type: String,
        default: 'All Year'
    },
    treatment: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Disease', DiseaseSchema);
