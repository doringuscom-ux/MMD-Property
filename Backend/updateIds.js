import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/propertyModel.js';

dotenv.config();

const updatePropertyIds = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const properties = await Property.find({ propertyId: { $exists: false } });
        console.log(`Found ${properties.length} properties without ID`);

        for (const property of properties) {
            // Logic to generate ID (same as model hook)
            const chars = '0123456789ABCDEF';
            let id = '';
            for (let i = 0; i < 8; i++) {
                id += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            property.propertyId = id;
            await property.save();
            console.log(`Updated property: ${property.title} -> ${id}`);
        }

        console.log('All properties updated successfully!');
        process.exit();
    } catch (error) {
        console.error('Error updating IDs:', error);
        process.exit(1);
    }
};

updatePropertyIds();
