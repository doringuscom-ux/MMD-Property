import mongoose from 'mongoose';

const enquirySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional if guest enquiry is allowed, but we usually want logged in users
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: false, // Optional for general enquiries from contact page
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Closed'],
      default: 'Pending',
    },
    adminNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;
