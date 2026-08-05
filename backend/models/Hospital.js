const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
    // Basic Profile
    name: { type: String, required: [true, 'Please add a hospital name'] },
    regNo: { type: String },
    type: { type: String, enum: ['Government', 'Private', 'PHC', 'Clinic'], default: 'Private' },
    establishedYear: { type: String },
    description: { type: String },
    ownerName: { type: String },
    
    // Contact Info
    email: { type: String },
    contact_number: { type: String, required: [true, 'Please add a contact number'] },
    emergencyNumber: { type: String },
    website: { type: String },

    // Location
    address: { type: String, required: [true, 'Please add an address'] },
    country: { type: String, default: 'India' },
    state: { type: String },
    district: { type: String },
    city: { type: String },
    village: { type: String },
    pincode: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },

    // Images
    logo: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    gallery: [{ type: String }],

    // Facilities (Using an array of strings or object map, let's use Array for simplicity matching frontend checkboxes)
    facilities: [{ type: String }],
    departments: [{ type: String }],

    // Bed Information
    totalBeds: { type: Number, default: 0 },
    availableBeds: { type: Number, default: 0 },
    occupiedBeds: { type: Number, default: 0 },
    icuBeds: { type: Number, default: 0 },
    emergencyBeds: { type: Number, default: 0 },
    generalBeds: { type: Number, default: 0 },

    // Operating Hours
    operatingHours: {
        monday: { type: String, default: '9:00 AM - 9:00 PM' },
        tuesday: { type: String, default: '9:00 AM - 9:00 PM' },
        wednesday: { type: String, default: '9:00 AM - 9:00 PM' },
        thursday: { type: String, default: '9:00 AM - 9:00 PM' },
        friday: { type: String, default: '9:00 AM - 9:00 PM' },
        saturday: { type: String, default: '9:00 AM - 9:00 PM' },
        sunday: { type: String, default: 'Closed' },
        emergency: { type: String, default: '24/7' }
    },

    // Social Links
    socialLinks: {
        facebook: { type: String },
        instagram: { type: String },
        linkedin: { type: String },
        youtube: { type: String }
    },
    
    // Stats
    doctorsCount: { type: Number, default: 0 },
    has_emergency: { type: Boolean, default: false },

    // Auth & Status
    username: { type: String },
    password: { type: String, required: [true, 'Please add a password'], minlength: 6, select: false },
    isApproved: { type: Boolean, default: false },
    verification: { type: String, enum: ['Verified', 'Pending', 'Rejected'], default: 'Pending' },
    status: { type: String, enum: ['Active', 'Under Review', 'Suspended'], default: 'Under Review' },

}, {
    timestamps: true
});

module.exports = mongoose.model('Hospital', HospitalSchema);
