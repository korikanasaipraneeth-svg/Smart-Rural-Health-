const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/smart-rural-health').then(async () => {
    const Hospital = require('./models/Hospital');
    const email = 'mohankrisna@gmail.com';
    const password = '1101@2007';

    const h = await Hospital.findOne({ $or: [{ email }, { username: email }] }).select('+password');
    if (!h) {
        console.log('Hospital not found');
        process.exit(1);
    }
    console.log('Found hospital:', h.email);
    console.log('Hash from DB:', h.password);
    
    const isMatch = await bcrypt.compare(password, h.password);
    console.log('Match:', isMatch);
    process.exit(0);
});
