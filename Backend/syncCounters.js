import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/propertyModel.js';
import Enquiry from './models/enquiryModel.js';
import User from './models/userModel.js';
import connectDB from './config/db.js';

dotenv.config();

const syncCounters = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    const properties = await Property.find({});
    console.log(`Found ${properties.length} properties. Syncing...`);

    for (const prop of properties) {
      const enquiries = await Enquiry.countDocuments({ property: prop._id });
      const usersWithFav = await User.countDocuments({ wishlist: prop._id });

      prop.enquiryCount = enquiries;
      prop.favoriteCount = usersWithFav;
      
      // We can't historically recover Views, so we leave it as is or default to 0
      prop.views = prop.views || 0;

      await prop.save();
      console.log(`Updated Property ID ${prop.propertyId}: Enquiries=${enquiries}, Favorites=${usersWithFav}`);
    }

    console.log('Successfully synced all historical data!');
    process.exit(0);
  } catch (error) {
    console.error('Error syncing:', error);
    process.exit(1);
  }
};

syncCounters();
