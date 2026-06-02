import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/userModel.js';

dotenv.config();

const migrateUsernames = async () => {
    try {
        await connectDB();

        const users = await User.find({ username: { $exists: false } });
        console.log(`Found ${users.length} users without username.`);

        for (const user of users) {
            let baseUsername = user.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (!baseUsername) baseUsername = 'user';
            
            let uniqueUsername = baseUsername;
            let isUnique = false;
            let counter = 1;

            while (!isUnique) {
                const existingUser = await User.findOne({ username: uniqueUsername });
                if (!existingUser) {
                    isUnique = true;
                } else {
                    const randomNum = Math.floor(100 + Math.random() * 900);
                    uniqueUsername = `${baseUsername}${randomNum}`;
                    counter++;
                }
            }

            user.username = uniqueUsername;
            await user.save();
            console.log(`Updated user ${user.email} with username: ${uniqueUsername}`);
        }

        console.log('Migration Completed Successfully!');
        process.exit();
    } catch (error) {
        console.error('Migration Failed:', error);
        process.exit(1);
    }
};

migrateUsernames();
