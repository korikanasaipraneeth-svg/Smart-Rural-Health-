const BloodBank = require('../models/BloodBank');
const Hospital = require('../models/Hospital');

// @desc    Get blood bank inventory for all hospitals in district network
// @route   GET /api/hospitals/blood-bank
// @access  Private (Hospital)
exports.getDistrictInventory = async (req, res) => {
    try {
        // Fetch all blood bank records and populate hospital details
        const inventory = await BloodBank.find()
            .populate('hospital', 'name district city phone has_emergency')
            .sort({ lastUpdated: -1 });
            
        // Find the current hospital's inventory too, to return separately for easy access
        let myInventory = inventory.find(i => i.hospital && i.hospital._id.toString() === req.user.id);
        
        // If myInventory doesn't exist, create a blank one for this hospital
        if (!myInventory) {
            myInventory = await BloodBank.create({ hospital: req.user.id });
            const populatedMyInventory = await BloodBank.findById(myInventory._id).populate('hospital', 'name district city phone has_emergency');
            inventory.push(populatedMyInventory);
            myInventory = populatedMyInventory;
        }

        res.status(200).json({ 
            success: true, 
            data: {
                myInventory,
                districtInventory: inventory.filter(i => i.hospital && i.hospital._id.toString() !== req.user.id)
            }
        });
    } catch (error) {
        console.error('Error fetching blood bank inventory:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update current hospital's blood inventory
// @route   PUT /api/hospitals/blood-bank
// @access  Private (Hospital)
exports.updateInventory = async (req, res) => {
    try {
        const { inventory } = req.body;
        
        if (!inventory) {
            return res.status(400).json({ success: false, message: 'Please provide inventory data' });
        }

        let bloodBank = await BloodBank.findOne({ hospital: req.user.id });
        
        if (!bloodBank) {
            bloodBank = new BloodBank({ hospital: req.user.id, inventory });
        } else {
            bloodBank.inventory = { ...bloodBank.inventory, ...inventory };
            bloodBank.lastUpdated = Date.now();
        }
        
        await bloodBank.save();
        
        res.status(200).json({ success: true, data: bloodBank });
    } catch (error) {
        console.error('Error updating blood inventory:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const BloodRequest = require('../models/BloodRequest');

exports.getHospitalBloodRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({ hospital: req.user.id })
            .populate('patient', 'full_name age gender phone blood_group')
            .sort({ date: -1 });
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        console.error('Error fetching blood requests:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateBloodRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await BloodRequest.findOne({ _id: req.params.id, hospital: req.user.id });
        
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        if (status === 'Approved' && request.status !== 'Approved') {
            let bloodBank = await BloodBank.findOne({ hospital: req.user.id });
            if (!bloodBank) {
                bloodBank = new BloodBank({ hospital: req.user.id });
            }
            
            if (request.type === 'Donation') {
                bloodBank.inventory[request.bloodGroup] += request.units;
            } else if (request.type === 'Request') {
                if (bloodBank.inventory[request.bloodGroup] < request.units) {
                    return res.status(400).json({ success: false, message: 'Insufficient blood stock' });
                }
                bloodBank.inventory[request.bloodGroup] -= request.units;
            }
            bloodBank.lastUpdated = Date.now();
            await bloodBank.save();
        }

        request.status = status;
        await request.save();
        
        res.status(200).json({ success: true, data: request });
    } catch (error) {
        console.error('Error updating blood request status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
