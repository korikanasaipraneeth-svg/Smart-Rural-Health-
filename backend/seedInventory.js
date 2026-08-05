const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hospital = require('./models/Hospital');
const InventoryItem = require('./models/InventoryItem');

dotenv.config();

async function seedInventory() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor-bangaram');
        console.log('MongoDB Connected.');

        const hospitals = await Hospital.find();
        if (hospitals.length === 0) {
            console.log('No hospital users found.');
            process.exit(1);
        }

        await InventoryItem.deleteMany(); // Clear existing inventory for all
        let totalInserted = 0;

        for (const hospital of hospitals) {
            const items = [
                {
                    name: 'Paracetamol 500mg',
                    category: 'Medicine',
                    quantity: 1500,
                    unit: 'tablets',
                    threshold: 200,
                    expiryDate: new Date('2027-12-31'),
                    supplier: 'PharmaCorp',
                    hospital: hospital._id
                },
                {
                    name: 'Amoxicillin 250mg',
                    category: 'Medicine',
                    quantity: 400,
                    unit: 'capsules',
                    threshold: 100,
                    expiryDate: new Date('2026-06-30'),
                    supplier: 'PharmaCorp',
                    hospital: hospital._id
                },
                {
                    name: 'Snake Antivenom (Polyvalent)',
                    category: 'Vaccine',
                    quantity: 3,
                    unit: 'vials',
                    threshold: 10,
                    expiryDate: new Date('2028-01-15'),
                    supplier: 'Gov Health Supplies',
                    hospital: hospital._id
                },
                {
                    name: 'Rabies Vaccine',
                    category: 'Vaccine',
                    quantity: 25,
                    unit: 'vials',
                    threshold: 30,
                    expiryDate: new Date('2026-11-20'),
                    supplier: 'Gov Health Supplies',
                    hospital: hospital._id
                },
                {
                    name: 'Oxygen Cylinders (Large)',
                    category: 'Oxygen',
                    quantity: 8,
                    unit: 'cylinders',
                    threshold: 15,
                    supplier: 'LifeBreath Inc.',
                    hospital: hospital._id
                },
                {
                    name: 'Surgical Masks',
                    category: 'Supplies',
                    quantity: 5000,
                    unit: 'pieces',
                    threshold: 1000,
                    supplier: 'MedEquip',
                    hospital: hospital._id
                },
                {
                    name: 'Syringes (5ml)',
                    category: 'Equipment',
                    quantity: 800,
                    unit: 'pieces',
                    threshold: 500,
                    supplier: 'MedEquip',
                    hospital: hospital._id
                },
                {
                    name: 'IV Fluids (Saline 500ml)',
                    category: 'Medicine',
                    quantity: 120,
                    unit: 'bottles',
                    threshold: 50,
                    expiryDate: new Date('2026-05-10'),
                    supplier: 'Gov Health Supplies',
                    hospital: hospital._id
                },
                {
                    name: 'Tetanus Toxoid Vaccine',
                    category: 'Vaccine',
                    quantity: 40,
                    unit: 'vials',
                    threshold: 20,
                    expiryDate: new Date('2027-02-14'),
                    supplier: 'PharmaCorp',
                    hospital: hospital._id
                },
                {
                    name: 'Metformin 500mg',
                    category: 'Medicine',
                    quantity: 2000,
                    unit: 'tablets',
                    threshold: 500,
                    expiryDate: new Date('2027-08-11'),
                    supplier: 'DiaCare Pharmaceuticals',
                    hospital: hospital._id
                },
                {
                    name: 'Amlodipine 5mg',
                    category: 'Medicine',
                    quantity: 1200,
                    unit: 'tablets',
                    threshold: 300,
                    expiryDate: new Date('2028-03-20'),
                    supplier: 'HeartHealth Inc.',
                    hospital: hospital._id
                },
                {
                    name: 'Ciprofloxacin 500mg',
                    category: 'Medicine',
                    quantity: 800,
                    unit: 'tablets',
                    threshold: 150,
                    expiryDate: new Date('2026-09-15'),
                    supplier: 'PharmaCorp',
                    hospital: hospital._id
                },
                {
                    name: 'Ibuprofen 400mg',
                    category: 'Medicine',
                    quantity: 3000,
                    unit: 'tablets',
                    threshold: 500,
                    expiryDate: new Date('2027-11-05'),
                    supplier: 'PainRelief Meds',
                    hospital: hospital._id
                },
                {
                    name: 'Oral Rehydration Salts (ORS)',
                    category: 'Supplies',
                    quantity: 500,
                    unit: 'sachets',
                    threshold: 100,
                    expiryDate: new Date('2029-01-01'),
                    supplier: 'Gov Health Supplies',
                    hospital: hospital._id
                },
                {
                    name: 'First Aid Bandages',
                    category: 'Supplies',
                    quantity: 10000,
                    unit: 'pieces',
                    threshold: 2000,
                    supplier: 'MedEquip',
                    hospital: hospital._id
                },
                {
                    name: 'Cotton Rolls (500g)',
                    category: 'Supplies',
                    quantity: 50,
                    unit: 'rolls',
                    threshold: 15,
                    supplier: 'MedEquip',
                    hospital: hospital._id
                },
                {
                    name: 'Rapid Malaria Diagnostic Kits',
                    category: 'Equipment',
                    quantity: 200,
                    unit: 'kits',
                    threshold: 50,
                    expiryDate: new Date('2026-08-30'),
                    supplier: 'BioDiagnostics',
                    hospital: hospital._id
                },
                {
                    name: 'Blood Pressure Monitor (Digital)',
                    category: 'Equipment',
                    quantity: 15,
                    unit: 'units',
                    threshold: 5,
                    supplier: 'HealthTech Devices',
                    hospital: hospital._id
                },
                {
                    name: 'Pulse Oximeters',
                    category: 'Equipment',
                    quantity: 25,
                    unit: 'units',
                    threshold: 5,
                    supplier: 'HealthTech Devices',
                    hospital: hospital._id
                },
                {
                    name: 'Thermometers (Digital)',
                    category: 'Equipment',
                    quantity: 40,
                    unit: 'units',
                    threshold: 10,
                    supplier: 'HealthTech Devices',
                    hospital: hospital._id
                },
                {
                    name: 'Oxygen Concentrator (5L)',
                    category: 'Oxygen',
                    quantity: 5,
                    unit: 'units',
                    threshold: 2,
                    supplier: 'LifeBreath Inc.',
                    hospital: hospital._id
                },
                {
                    name: 'DPT Vaccine',
                    category: 'Vaccine',
                    quantity: 60,
                    unit: 'vials',
                    threshold: 20,
                    expiryDate: new Date('2026-10-10'),
                    supplier: 'Gov Health Supplies',
                    hospital: hospital._id
                },
                {
                    name: 'Polio Drops (OPV)',
                    category: 'Vaccine',
                    quantity: 100,
                    unit: 'vials',
                    threshold: 30,
                    expiryDate: new Date('2027-05-15'),
                    supplier: 'Gov Health Supplies',
                    hospital: hospital._id
                },
                {
                    name: 'Azithromycin 500mg',
                    category: 'Medicine',
                    quantity: 600,
                    unit: 'tablets',
                    threshold: 100,
                    expiryDate: new Date('2027-04-20'),
                    supplier: 'PharmaCorp',
                    hospital: hospital._id
                }
            ];

            await InventoryItem.insertMany(items);
            totalInserted += items.length;
        }

        console.log(`Successfully added ${totalInserted} fake inventory items across ${hospitals.length} hospitals.`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedInventory();
