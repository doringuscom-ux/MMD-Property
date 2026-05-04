import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import OTP from '../models/otpModel.js';
import { sendOTP } from '../utils/emailService.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

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
            phone: user.phone,
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

// @desc    Send OTP to email
// @route   POST /api/users/send-otp
export const sendOTPRequest = async (req, res) => {
    const { email, isRegistration } = req.body;

    if (process.env.WORKING_STATUS !== 'done') {
        return res.status(403).json({ message: 'OTP Service is temporarily disabled for maintenance.' });
    }

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user already exists (only for registration)
    if (isRegistration) {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        // Save OTP to DB
        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );

        // Send Email
        const emailSent = await sendOTP(email, otp);
        if (emailSent) {
            res.json({ message: 'OTP sent successfully' });
        } else {
            res.status(500).json({ message: 'Failed to send OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new user
// @route   POST /api/users
export const registerUser = async (req, res) => {
    const { name, email, password, phone, otp } = req.body;

    if (!otp) {
        return res.status(400).json({ message: 'OTP is required' });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

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
        role: 'user',
        isVerified: true // Mark as verified if OTP matches
    });

    if (user) {
        // Delete OTP after successful registration
        await OTP.deleteOne({ email });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
    const { name, email, phone, password, otp } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // If email or password is being changed, verify OTP or Old Password
    if ((email && email !== user.email) || password) {
        let isVerified = false;

        // Option 1: Verify with Old Password (for password change only)
        if (password && req.body.oldPassword) {
            const isMatch = await user.matchPassword(req.body.oldPassword);
            if (isMatch) {
                isVerified = true;
            } else {
                return res.status(400).json({ message: 'Incorrect old password' });
            }
        }

        // Option 2: Verify with OTP (if not already verified by old password)
        if (!isVerified) {
            if (!otp) {
                return res.status(400).json({ message: 'OTP or Old Password is required to change settings' });
            }
            
            const verifyEmail = (email && email !== user.email) ? email : user.email;
            const otpRecord = await OTP.findOne({ email: verifyEmail, otp });
            
            if (!otpRecord) {
                return res.status(400).json({ message: 'Invalid or expired OTP' });
            }
            await OTP.deleteOne({ email: verifyEmail });
        }

        // Apply changes
        if (email && email !== user.email) {
            const emailTaken = await User.findOne({ email });
            if (emailTaken) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = email;
        }

        if (password) {
            user.password = password;
        }
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        token: generateToken(updatedUser._id)
    });
};

// @desc    Upload user avatar
// @route   POST /api/users/avatar
export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'mmd_avatars',
            width: 150,
            crop: "scale"
        });

        // Delete local file
        fs.unlinkSync(req.file.path);

        // Update user
        user.avatar = result.secure_url;
        await user.save();

        res.json({
            message: 'Profile image updated',
            avatar: user.avatar
        });
    } catch (error) {
        console.error('Avatar Upload Error:', error);
        res.status(500).json({ message: error.message });
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
// @desc    Toggle property in wishlist
// @route   POST /api/users/wishlist/:id
export const toggleWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const propertyId = req.params.id;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.wishlist.indexOf(propertyId);
        if (index === -1) {
            user.wishlist.push(propertyId);
            await user.save();
            res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
        } else {
            user.wishlist.splice(index, 1);
            await user.save();
            res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        if (user) {
            res.json(user.wishlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
