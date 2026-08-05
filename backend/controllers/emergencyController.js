const Hospital = require('../models/Hospital');
const EmergencyRequest = require('../models/EmergencyRequest');
const { sendSMS } = require('../services/notificationService');

// @desc    Update hospital bed availability
// @route   PUT /api/emergency/beds
// @access  Private (Hospital)
exports.updateBedAvailability = async (req, res) => {
    try {
        const { totalBeds, availableBeds, occupiedBeds, icuBeds, emergencyBeds, generalBeds } = req.body;

        const hospital = await Hospital.findById(req.user.id);
        if (!hospital) {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }

        // Update fields if provided
        if (totalBeds !== undefined) hospital.totalBeds = totalBeds;
        if (availableBeds !== undefined) hospital.availableBeds = availableBeds;
        if (occupiedBeds !== undefined) hospital.occupiedBeds = occupiedBeds;
        if (icuBeds !== undefined) hospital.icuBeds = icuBeds;
        if (emergencyBeds !== undefined) hospital.emergencyBeds = emergencyBeds;
        if (generalBeds !== undefined) hospital.generalBeds = generalBeds;

        await hospital.save();

        res.status(200).json({
            success: true,
            data: {
                totalBeds: hospital.totalBeds,
                availableBeds: hospital.availableBeds,
                occupiedBeds: hospital.occupiedBeds,
                icuBeds: hospital.icuBeds,
                emergencyBeds: hospital.emergencyBeds,
                generalBeds: hospital.generalBeds
            }
        });
    } catch (error) {
        console.error('Error updating beds:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all emergency requests for a hospital
// @route   GET /api/emergency/requests
// @access  Private (Hospital)
exports.getEmergencyRequests = async (req, res) => {
    try {
        const requests = await EmergencyRequest.find({ hospital: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        console.error('Error fetching emergency requests:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update emergency request status (Accept/Reject)
// @route   PUT /api/emergency/requests/:id
// @access  Private (Hospital)
exports.updateEmergencyStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const request = await EmergencyRequest.findOne({ _id: req.params.id, hospital: req.user.id });
        if (!request) {
            return res.status(404).json({ success: false, message: 'Emergency request not found' });
        }

        request.status = status;
        await request.save();

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('Error updating emergency status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    [DEV ONLY] Create a fake emergency request for testing
// @route   POST /api/emergency/fake
// @access  Private (Hospital)
exports.createFakeEmergency = async (req, res) => {
    try {
        const conditions = ['Severe Heart Attack', 'Road Traffic Accident', 'Stroke', 'Severe Asthma Attack', 'Burn Injury'];
        const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown'];
        const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

        const request = await EmergencyRequest.create({
            hospital: req.user.id,
            patientName: names[Math.floor(Math.random() * names.length)],
            contactNumber: "9876543210",
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            expectedArrivalTime: `${Math.floor(Math.random() * 30) + 5} mins`,
            assignedAmbulance: `AMB-${Math.floor(Math.random() * 9000) + 1000}`,
            status: 'Pending'
        });

        // Trigger SMS Notification to Hospital Emergency Contact
        const hospital = await Hospital.findById(req.user.id);
        if (hospital && hospital.emergencyNumber) {
            await sendSMS(
                hospital.emergencyNumber, 
                `EMERGENCY ALERT: Incoming patient ${request.patientName}. Condition: ${request.condition}. ETA: ${request.expectedArrivalTime}.`
            );
        }

        res.status(201).json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('Error creating fake emergency:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Request an ambulance (Patient)
// @route   POST /api/emergency/request-ambulance
// @access  Private (Patient)
exports.requestAmbulance = async (req, res) => {
    try {
        const { latitude, longitude, condition } = req.body;
        
        // In a real app, find nearest hospital. For now, just create a request.
        const request = await EmergencyRequest.create({
            patient: req.user.id,
            patientName: req.user.name || 'Emergency Patient',
            contactNumber: req.user.phone || '9999999999',
            condition: condition || 'Emergency',
            latitude,
            longitude,
            status: 'Accepted', // Auto accept for mock
            assignedAmbulance: 'AMB-101',
            ambulanceLocation: { lat: latitude + 0.05, lng: longitude + 0.05 } // Start slightly away
        });

        res.status(201).json({ success: true, data: request });
    } catch (error) {
        console.error('Request ambulance error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Track ambulance (Patient)
// @route   GET /api/emergency/track/:id
// @access  Private (Patient)
exports.trackAmbulance = async (req, res) => {
    try {
        const request = await EmergencyRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
        
        // Simulate movement towards patient
        if (request.status === 'Accepted') {
            const latDiff = request.latitude - request.ambulanceLocation.lat;
            const lngDiff = request.longitude - request.ambulanceLocation.lng;
            
            // Move 10% closer each poll
            request.ambulanceLocation.lat += latDiff * 0.1;
            request.ambulanceLocation.lng += lngDiff * 0.1;
            
            // If very close, resolve
            if (Math.abs(latDiff) < 0.001 && Math.abs(lngDiff) < 0.001) {
                request.status = 'Resolved';
            }
            
            await request.save();
        }

        res.status(200).json({ success: true, data: request });
    } catch (error) {
        console.error('Track ambulance error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
