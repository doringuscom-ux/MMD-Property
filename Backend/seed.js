import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const seedAdmins = async () => {
    try {
        const admins = [
            {
                name: 'Main Admin',
                email: 'admin@gmail.com',
                password: 'AdminPassword@123',
                role: 'admin',
                isVerified: true
            },
            {
                name: 'Sub Admin',
                email: 'subadmin@mmdproperty.com',
                password: 'SubAdminPassword@123',
                role: 'admin',
                isVerified: true
            },
            {
                name: 'Rakesh Saini',
                email: 'sainirakesh3221@gmail.com',
                password: 'RakeshPassword@123',
                role: 'admin',
                isVerified: true
            }
        ];

        for (const admin of admins) {
            const userExists = await User.findOne({ email: admin.email });
            if (userExists) {
                userExists.role = 'admin';
                userExists.isVerified = true;
                // If you want to update password, uncomment below:
                // userExists.password = admin.password;
                await userExists.save();
                console.log(`Updated existing user to Admin: ${admin.email}`);
            } else {
                await User.create(admin);
                console.log(`Created new Admin: ${admin.email}`);
            }
        }

        console.log('Admin seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error seeding admins: ${error.message}`);
        process.exit(1);
    }
};

seedAdmins();
