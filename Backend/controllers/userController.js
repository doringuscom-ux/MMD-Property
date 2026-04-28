import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
export const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && user.isBlocked) {
        res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
        return;
    }

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);

        // Set JWT as HTTP-Only Cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // Use secure in production
            sameSite: 'strict', // Prevent CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Register a new user
// @route   POST /api/users
export const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
        role: 'user' // Default to user
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
export const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
export const updateUserRole = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.role = req.body.role || user.role;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
export const updateUserByAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            user.phone = req.body.phone || user.phone;
            user.isBlocked = req.body.isBlocked !== undefined ? req.body.isBlocked : user.isBlocked;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isBlocked: updatedUser.isBlocked
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'admin') {
                res.status(400).json({ message: 'Cannot delete admin user' });
                return;
            }
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};
