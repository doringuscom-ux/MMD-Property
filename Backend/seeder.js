import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Property from './models/propertyModel.js';
import Location from './models/locationModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Property.deleteMany();
        await Location.deleteMany();

        const adminUser = await User.create({
            name: 'Admin',
            email: 'admin@gmail.com',
            password: 'password123',
            role: 'admin',
            phone: '1234567890'
        });

        const subAdminUser = await User.create({
            name: 'Sub Admin One',
            email: 'subadmin@mmdproperty.com',
            password: 'subadminpassword123',
            role: 'sub-admin',
            phone: '0987654321'
        });

        const adminId = adminUser._id;

        const cityNames = [
            'Chandigarh', 'Panchkula', 'Mohali', 'Zirakpur', 'Derabassi', 'Lalru', 'Kharar', 'New Chandigarh'
        ];

        const locations = cityNames.map(city => ({
            name: city,
            status: 'Active',
            mapEmbedLink: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3429!2d76.7!3d30.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s${encodeURIComponent(city)}!5e0!3m2!1sen!2sin!4v1!5m2!1sen!2sin`,
            description: `Explore premium properties and real estate in ${city}.`
        }));

        await Location.insertMany(locations);

        const properties = [
            {
                title: 'Luxury 3BHK Flat in Zirakpur',
                description: 'Spacious 3BHK with premium amenities and excellent connectivity.',
                price: 6500000,
                location: 'VIP Road',
                city: 'Zirakpur',
                status: 'For Sale',
                propertyType: 'Apartment',
                bedrooms: 3,
                bathrooms: 3,
                area: 1800,
                featured: true,
                mapLink: 'https://maps.app.goo.gl/exampleZirakpur',
                postedBy: adminId,
                isVerified: true,
                images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800']
            },
            {
                title: 'Premium Office Space in Chandigarh',
                description: 'Fully furnished office space in the heart of the city.',
                price: 12000000,
                location: 'Sector 17',
                city: 'Chandigarh',
                status: 'Commercial',
                propertyType: 'Office',
                bedrooms: 0,
                bathrooms: 2,
                area: 2500,
                featured: true,
                mapLink: 'https://maps.app.goo.gl/exampleChandigarh',
                postedBy: adminId,
                isVerified: true,
                images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800']
            },
            {
                title: '4BHK Independent Villa',
                description: 'Luxurious 4BHK villa with a private garden.',
                price: 15000000,
                location: 'Sector 6',
                city: 'Panchkula',
                status: 'Premium',
                propertyType: 'Villa',
                bedrooms: 4,
                bathrooms: 4,
                area: 3200,
                featured: true,
                mapLink: 'https://maps.app.goo.gl/exampleVilla',
                postedBy: adminId,
                isVerified: true,
                images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800']
            }
        ];

        const propertyTypes = ['Apartment', 'Villa', 'Office', 'Plot', 'Shop'];
        const statuses = ['For Sale', 'For Rent', 'Commercial', 'New Launch', 'Premium'];
        const propertyImages = [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=800'
        ];

        for (let i = 0; i < 27; i++) {
            const rCity = cityNames[Math.floor(Math.random() * cityNames.length)];
            const rType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
            const rStatus = (rType === 'Office' || rType === 'Shop') ? 'Commercial' : statuses[Math.floor(Math.random() * statuses.length)];

            const beds = rType === 'Plot' || rType === 'Office' || rType === 'Shop' ? 0 : Math.floor(Math.random() * 4) + 1;

            properties.push({
                title: `Premium ${beds > 0 ? beds + 'BHK ' : ''}${rType} in ${rCity}`,
                description: `A beautifully designed ${rType.toLowerCase()} available ${rStatus.toLowerCase() === 'commercial' ? 'for commercial use' : rStatus.toLowerCase()} in the prime location of ${rCity}. Features excellent amenities and connectivity.`,
                price: Math.floor(Math.random() * 200) * 100000 + 2000000,
                location: `Sector ${Math.floor(Math.random() * 30) + 1}`,
                city: rCity,
                status: rStatus,
                propertyType: rType,
                bedrooms: beds,
                bathrooms: beds > 0 ? beds : (rType === 'Plot' ? 0 : 1),
                area: Math.floor(Math.random() * 2000) + 500,
                featured: Math.random() > 0.8,
                mapLink: `https://maps.app.goo.gl/example${rCity.replace(/\s+/g, '')}`,
                postedBy: adminId,
                isVerified: true,
                images: [propertyImages[Math.floor(Math.random() * propertyImages.length)]]
            });
        }

        await Property.insertMany(properties);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Property.deleteMany();
        await Location.deleteMany();
        await User.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
