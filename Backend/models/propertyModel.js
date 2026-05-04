import mongoose from 'mongoose';

const propertySchema = mongoose.Schema({
    propertyId: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: true,
        enum: ['Chandigarh', 'Panchkula', 'Mohali', 'Zirakpur', 'Derabassi', 'Lalru', 'Kharar', 'New Chandigarh'],
        default: 'Chandigarh'
    },
    status: { 
        type: String, 
        required: true, 
        enum: ['For Sale', 'For Rent', 'Commercial', 'New Launch', 'Premium'],
        default: 'For Sale'
    },
    images: [{
        type: String
    }],
    propertyType: {
        type: String,
        required: true
    },
    bedrooms: Number,
    bathrooms: Number,
    area: Number,
    featured: {
        type: Boolean,
        default: false
    },
    adminStatus: {
        type: String,
        enum: ['Published', 'Pending', 'Draft'],
        default: 'Published'
    },
    mapLink: {
        type: String
    },
    coordinates: {
        lat: Number,
        lng: Number
    },
    furnishing: {
        type: String,
        enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
        default: 'Unfurnished'
    },
    floor: {
        type: String
    },
    facing: {
        type: String,
        enum: ['North', 'East', 'South', 'West', 'North-East', 'North-West', 'South-East', 'South-West', 'None'],
        default: 'None'
    },
    builtYear: {
        type: Number
    },
    readyStatus: {
        type: String,
        enum: ['Ready to Move', 'Under Construction'],
        default: 'Ready to Move'
    },
    premiumFeatures: {
        type: String
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isPromoted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Generate unique propertyId before saving
propertySchema.pre('save', async function () {
    if (!this.propertyId) {
        // Generate a random 8 character hex-like ID
        const chars = '0123456789ABCDEF';
        let id = '';
        for (let i = 0; i < 8; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.propertyId = id;
    }
});

const Property = mongoose.model('Property', propertySchema);

export default Property;
