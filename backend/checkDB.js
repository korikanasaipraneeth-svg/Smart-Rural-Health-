const mongoose = require('mongoose');
const Hospital = require('./models/Hospital');

mongoose.connect('mongodb://localhost:27017/smart_health_db')
  .then(async () => {
    try {
        const hospitals = await Hospital.find({ status: 'Approved' }).select('name address city');
        console.log('Approved:', hospitals.length);
        const allHospitals = hospitals.length > 0 ? hospitals : await Hospital.find().select('name address city');
        console.log('All fetched:', allHospitals.length);
    } catch (e) {
        console.error(e);
    }
    mongoose.disconnect();
  });
