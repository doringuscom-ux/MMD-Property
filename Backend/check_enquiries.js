import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Enquiry from './models/enquiryModel.js';

dotenv.config();

const checkEnquiries = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const count = await Enquiry.countDocuments({});
    console.log(`Total Enquiries: ${count}`);
    
    const enquiries = await Enquiry.find({}).limit(5);
    console.log('Recent Enquiries:', enquiries);
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkEnquiries();
