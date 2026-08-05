const InventoryItem = require('../models/InventoryItem');
const SupplyTransfer = require('../models/SupplyTransfer');

// @desc    Get all inventory items for a hospital
// @route   GET /api/inventory
// @access  Private (Hospital)
exports.getInventory = async (req, res) => {
    try {
        const inventory = await InventoryItem.find({ hospital: req.user.id }).sort({ category: 1, name: 1 });
        res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Helper to calculate depletion date
const calculateDepletionDate = (quantity, dailyConsumptionRate) => {
    if (!dailyConsumptionRate || dailyConsumptionRate <= 0) return null;
    const daysRemaining = quantity / dailyConsumptionRate;
    const depletionDate = new Date();
    depletionDate.setDate(depletionDate.getDate() + daysRemaining);
    return depletionDate;
};

// @desc    Add new inventory item
// @route   POST /api/inventory
// @access  Private (Hospital)
exports.addInventoryItem = async (req, res) => {
    try {
        const payload = { ...req.body, hospital: req.user.id };
        if (payload.quantity > 0 && payload.dailyConsumptionRate > 0) {
            payload.predictedDepletionDate = calculateDepletionDate(payload.quantity, payload.dailyConsumptionRate);
        }

        const newItem = new InventoryItem(payload);
        const savedItem = await newItem.save();
        res.status(201).json({ success: true, data: savedItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private (Hospital)
exports.updateInventoryItem = async (req, res) => {
    try {
        let item = await InventoryItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        if (item.hospital.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const payload = { ...req.body };
        const quantity = payload.quantity !== undefined ? payload.quantity : item.quantity;
        const rate = payload.dailyConsumptionRate !== undefined ? payload.dailyConsumptionRate : item.dailyConsumptionRate;
        
        if (quantity > 0 && rate > 0) {
            payload.predictedDepletionDate = calculateDepletionDate(quantity, rate);
        } else {
            payload.predictedDepletionDate = null;
        }

        item = await InventoryItem.findByIdAndUpdate(req.params.id, payload, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private (Hospital)
exports.deleteInventoryItem = async (req, res) => {
    try {
        const item = await InventoryItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        if (item.hospital.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await item.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Run AI Predictions and Recommend Transfers
// @route   GET /api/inventory/predict
// @access  Private (Admin/Hospital)
exports.runPredictions = async (req, res) => {
    try {
        // Find all items globally that are depleting in less than 7 days
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 7);

        const criticalItems = await InventoryItem.find({
            predictedDepletionDate: { $lte: targetDate, $ne: null }
        }).populate('hospital', 'name');

        const recommendations = [];

        // For each critical item, find a hospital that has excess (depletion > 30 days)
        for (const item of criticalItems) {
            const safeDate = new Date();
            safeDate.setDate(safeDate.getDate() + 30);

            const excessItem = await InventoryItem.findOne({
                name: item.name,
                hospital: { $ne: item.hospital._id },
                $or: [
                    { predictedDepletionDate: { $gte: safeDate } },
                    { predictedDepletionDate: null, quantity: { $gt: item.threshold * 5 } }
                ]
            }).populate('hospital', 'name');

            if (excessItem) {
                const suggestedQty = Math.floor(excessItem.quantity * 0.2);

                // Check if a pending transfer already exists for this exact case
                const existingTransfer = await SupplyTransfer.findOne({
                    item: item._id,
                    sourceHospital: excessItem.hospital._id,
                    targetHospital: item.hospital._id,
                    status: 'Pending'
                });

                if (!existingTransfer && suggestedQty > 0) {
                    const transfer = new SupplyTransfer({
                        item: item._id,
                        itemName: item.name,
                        sourceHospital: excessItem.hospital._id,
                        targetHospital: item.hospital._id,
                        quantity: suggestedQty,
                        isAiRecommended: true
                    });
                    await transfer.save();
                    
                    recommendations.push({
                        ...transfer._doc,
                        sourceHospital: excessItem.hospital,
                        targetHospital: item.hospital,
                        daysUntilDepletion: Math.floor((item.predictedDepletionDate - new Date()) / (1000 * 60 * 60 * 24))
                    });
                }
            }
        }

        res.status(200).json({ success: true, data: { criticalItems, recommendations } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all Supply Transfers (For Admin)
// @route   GET /api/inventory/transfers
// @access  Private (Admin)
exports.getTransfers = async (req, res) => {
    try {
        const transfers = await SupplyTransfer.find()
            .populate('sourceHospital', 'name')
            .populate('targetHospital', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: transfers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update Supply Transfer Status
// @route   PUT /api/inventory/transfers/:id
// @access  Private (Admin)
exports.updateTransferStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const transfer = await SupplyTransfer.findById(req.params.id);

        if (!transfer) return res.status(404).json({ success: false, message: 'Transfer not found' });

        if (status === 'Approved') {
            // Deduct from source
            const sourceItem = await InventoryItem.findOne({ name: transfer.itemName, hospital: transfer.sourceHospital });
            if (sourceItem) {
                sourceItem.quantity -= transfer.quantity;
                await sourceItem.save();
            }

            // Add to target
            let targetItem = await InventoryItem.findById(transfer.item);
            if (targetItem) {
                targetItem.quantity += transfer.quantity;
                await targetItem.save();
            }
        }

        transfer.status = status;
        await transfer.save();

        res.status(200).json({ success: true, data: transfer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
