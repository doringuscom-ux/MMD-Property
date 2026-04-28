import Property from '../models/propertyModel.js';

// @desc    Fetch all properties
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
    try {
        const pageSize = Number(req.query.pageSize) || 10;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword ? {
            $or: [
                { title: { $regex: req.query.keyword, $options: 'i' } },
                { location: { $regex: req.query.keyword, $options: 'i' } }
            ]
        } : {};

        const propertyType = req.query.propertyType && req.query.propertyType !== 'All'
            ? { propertyType: req.query.propertyType }
            : {};

        const status = req.query.status && req.query.status !== 'All'
            ? { status: req.query.status }
            : {};

        const bedrooms = req.query.bedrooms && req.query.bedrooms !== 'Any'
            ? { bedrooms: req.query.bedrooms === '5+' ? { $gte: 5 } : Number(req.query.bedrooms) }
            : {};

        // Price logic
        let priceQuery = {};
        if (req.query.minPrice || req.query.maxPrice) {
            priceQuery.price = {};
            if (req.query.minPrice) priceQuery.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) priceQuery.price.$lte = Number(req.query.maxPrice);
        } else if (req.query.budget && req.query.budget !== 'Any Budget') {
            // Keep legacy budget string support if needed
            if (req.query.budget === 'Under 50 Lakhs') priceQuery = { price: { $lt: 5000000 } };
            else if (req.query.budget === '50 Lakhs - 1 Crore') priceQuery = { price: { $gte: 5000000, $lte: 10000000 } };
            else if (req.query.budget === '1 Crore - 2 Crore') priceQuery = { price: { $gte: 10000000, $lte: 20000000 } };
            else if (req.query.budget === '2 Crore - 5 Crore') priceQuery = { price: { $gte: 20000000, $lte: 50000000 } };
            else if (req.query.budget === 'Above 5 Crore') priceQuery = { price: { $gt: 50000000 } };
        }

        const adminStatus = req.query.showAll === 'true'
            ? {}
            : { adminStatus: 'Published' };

        // Handle verification visibility
        // If showAll=true (admin request), show everything. 
        // Otherwise, show only verified properties.
        const verificationQuery = req.query.showAll === 'true' ? {} : { isVerified: true };

        const query = { ...keyword, ...propertyType, ...status, ...bedrooms, ...priceQuery, ...adminStatus, ...verificationQuery };

        const count = await Property.countDocuments(query);
        const properties = await Property.find(query)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 })
            .populate('postedBy', 'name email role')
            .populate('updatedBy', 'name email role');

        res.json({ properties, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single property
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (property) {
            res.json(property);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a property
// @route   POST /api/properties
// @access  Private (Admin/Sub-Admin/User)
export const createProperty = async (req, res) => {
    try {
        const { title, description, price, location, propertyType, bedrooms, bathrooms, area } = req.body;

        // If a regular user posts, it stays unverified
        const isVerified = req.user.role === 'admin' || req.user.role === 'sub-admin';

        const property = new Property({
            ...req.body,
            postedBy: req.user._id,
            isVerified: isVerified
        });

        const createdProperty = await property.save();
        res.status(201).json(createdProperty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private
export const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (property) {
            // Check if sub-admin is trying to edit someone else's post? 
            // User said "admin sab edit kar saka", implying sub-admin might be restricted or can only edit theirs.
            // But usually sub-admins can edit everything. I'll allow everything for now but track who edited.

            Object.assign(property, req.body);
            property.updatedBy = req.user._id;

            const updatedProperty = await property.save();
            res.json(updatedProperty);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
export const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (property) {
            await property.deleteOne();
            res.json({ message: 'Property removed' });
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Bulk update properties
// @route   PUT /api/properties/bulk-update
// @access  Private/Admin
export const bulkUpdateProperties = async (req, res) => {
    try {
        const { ids, updateData } = req.body;
        await Property.updateMany({ _id: { $in: ids } }, { $set: updateData });
        res.json({ message: 'Properties updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Bulk delete properties
// @route   DELETE /api/properties/bulk-delete
// @access  Private/Admin
export const bulkDeleteProperties = async (req, res) => {
    try {
        const { ids } = req.body;
        await Property.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Properties deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
