import Location from '../models/locationModel.js';
import Property from '../models/propertyModel.js';

// @desc    Get all locations (Merged with auto-discovered locations from properties)
// @route   GET /api/locations
export const getLocations = async (req, res) => {
    try {
        // 1. Get manually managed locations
        const manualLocations = await Location.find();
        
        // 2. Get unique locations from all properties
        const propertyLocations = await Property.distinct('location');
        
        // 3. Merge them
        let allLocationNames = [...new Set([
            ...manualLocations.map(l => l.name),
            ...propertyLocations
        ])];

        const enhancedLocations = await Promise.all(allLocationNames.map(async (name) => {
            const manualLoc = manualLocations.find(l => l.name === name);
            const propertyCount = await Property.countDocuments({ location: name });
            
            // Find the first property in this location that has a map link
            const propertyWithMap = await Property.findOne({ location: name, mapLink: { $exists: true, $ne: '' } });
            
            const mapEmbedLink = manualLoc?.mapEmbedLink || propertyWithMap?.mapLink || '';

            // Only return if it has a map link
            if (!mapEmbedLink) return null;

            return {
                _id: manualLoc ? manualLoc._id : `temp-${name}`,
                name,
                status: manualLoc ? manualLoc.status : 'Live Map',
                propertyCount,
                mapEmbedLink,
                description: manualLoc ? manualLoc.description : '',
                isManual: !!manualLoc,
                createdAt: manualLoc ? manualLoc.createdAt : new Date()
            };
        }));
        
        // Remove null entries and sort by property count
        const filteredLocations = enhancedLocations.filter(loc => loc !== null);
        filteredLocations.sort((a, b) => b.propertyCount - a.propertyCount);

        res.json(filteredLocations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a location
// @route   POST /api/locations
export const createLocation = async (req, res) => {
    try {
        const { name, status, mapEmbedLink, description, image } = req.body;
        const location = new Location({ name, status, mapEmbedLink, description, image });
        const createdLocation = await location.save();
        res.status(201).json(createdLocation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a location
// @route   PUT /api/locations/:id
export const updateLocation = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (location) {
            location.name = req.body.name || location.name;
            location.status = req.body.status || location.status;
            location.mapEmbedLink = req.body.mapEmbedLink || location.mapEmbedLink;
            location.description = req.body.description || location.description;
            location.image = req.body.image || location.image;
            
            const updatedLocation = await location.save();
            res.json(updatedLocation);
        } else {
            res.status(404).json({ message: 'Location not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a location
// @route   DELETE /api/locations/:id
export const deleteLocation = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (location) {
            await location.deleteOne();
            res.json({ message: 'Location removed' });
        } else {
            res.status(404).json({ message: 'Location not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
