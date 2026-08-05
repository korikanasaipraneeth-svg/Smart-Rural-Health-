const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

connectDB().then(async () => {
    try {
        const adminEmail = 'korikanasaipraneeth@gmail.com';
        const user = await User.findOne({ email: adminEmail });
        
        if (user) {
            console.log("Admin user found in DB:", { email: user.email, role: user.role });
            // Let's reset the password to 'admin123' so the user can definitely log in.
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash('admin123', salt);
            await user.save();
            console.log("Password reset to: admin123");
        } else {
            console.log("Admin user NOT found in DB. Creating one now...");
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            
            await User.create({
                full_name: 'Super Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                phone: '9999999999'
            });
            console.log(`Created admin user with email: ${adminEmail}, password: admin123`);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
});
