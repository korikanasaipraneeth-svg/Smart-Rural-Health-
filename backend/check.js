const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');
const Hospital = require('./models/Hospital');
mongoose.connect(process.env.MONGO_URI).then(async () => {
    const h = await Hospital.find().limit(3);
    console.log('Hospitals:', h.map(x=>({id: x._id, name: x.name, email: x.email, user: x.user})));
    const u = await User.find({ role: { $ne: 'patient' } });
    console.log('Users (non-patient):', u.map(x=>({id: x._id, email: x.email, role: x.role})));
    process.exit(0);
});
