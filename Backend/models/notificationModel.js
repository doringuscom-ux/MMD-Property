import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for guest enquiries
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // If null, it's an admin notification
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
        enum: ['PropertyAdded', 'PropertyUpdated', 'EnquiryAdded', 'PropertyPublished', 'LocationRequested'],
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
