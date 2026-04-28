import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    coordinates: {
        lat: Number,
        lng: Number
    },
    mapEmbedLink: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    }
}, {
    timestamps: true
});

const Location = mongoose.model('Location', locationSchema);
export default Location;
