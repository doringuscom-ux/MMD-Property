import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for guest enquiries
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: false // Optional for general enquiries
    },
    enquiry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enquiry',
        required: false
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['PropertyAdded', 'PropertyUpdated', 'EnquiryAdded'],
        default: 'PropertyAdded'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
