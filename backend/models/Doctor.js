const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    
    // Basic Info
    name: {
        type: String,
        required: [true, 'Please add a doctor name'],
        trim: true,
        maxlength: [100, 'Name can not be more than 100 characters']
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ],
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        select: false
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
        maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    dob: {
        type: Date
    },
    address: {
        type: String
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },

    // Professional Info
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    stateMedicalCouncil: {
        type: String,
        required: true
    },
    qualification: {
        type: String, // e.g., MBBS, MD, MS
        required: true
    },
    specialization: {
        type: String, // e.g., Cardiology, Neurology
        required: true
    },
    department: {
        type: String, // e.g., General Medicine
        required: true
    },
    experienceYears: {
        type: Number,
        required: true,
        min: 0
    },
    consultationFee: {
        type: Number,
        required: true
    },

    // Education details array
    education: [{
        degree: String,
        college: String,
        yearOfCompletion: Number
    }],

    // Certificates Array
    certificates: [String],

    // Availability Matrix
    availability: {
        days: [{
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        }],
        startTime: String, // e.g., "09:00 AM"
        endTime: String,   // e.g., "05:00 PM"
        avgConsultationTime: {
            type: Number, // in minutes
            default: 15
        }
    },

    // Statistics / Rating
    patientsTreated: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5.0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    
    // Status
    status: {
        type: String,
        enum: ['Active', 'On Leave', 'Inactive'],
        default: 'Active'
    },
    verification: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    },
    role: {
        type: String,
        default: 'doctor'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Reverse populate with reviews if we add them later
DoctorSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'doctor',
    justOne: false
});

module.exports = mongoose.model('Doctor', DoctorSchema);
