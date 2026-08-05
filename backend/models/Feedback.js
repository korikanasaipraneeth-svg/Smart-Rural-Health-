const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    feedbackId: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['Patient', 'Doctor', 'Hospital'],
        default: 'Patient'
    },
    hospital: {
        type: String
    },
    category: {
        type: String,
        enum: ['Suggestion', 'Complaint', 'Bug Report', 'App Feedback'],
        default: 'Suggestion'
    },
    subject: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    status: {
        type: String,
        enum: ['New', 'In Progress', 'Resolved', 'Closed'],
        default: 'New'
    },
    description: {
        type: String,
        required: true
    },
    reply: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
