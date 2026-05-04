import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// The Google Apps Script Proxy URL (provided by user)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbySIgBxebdq8QDZXFWgsnSqLoDpaw7NkmeIqAufqcZ2rRFGGAwOJgTe9SadBpkTzTAo/exec';

export const sendOTP = async (email, otp) => {
    try {
        const subject = 'Your Registration OTP - Maa Mansa Devi Property';
        const message = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                <h2 style="color: #2563eb; text-align: center;">Welcome to Maa Mansa Devi Property</h2>
                <p>Hello,</p>
                <p>Thank you for registering. Please use the following OTP to verify your account:</p>
                <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; border-radius: 8px; margin: 20px 0; color: #2563eb; letter-spacing: 5px;">
                    ${otp}
                </div>
                <p>This OTP will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 10px; color: #aaa; text-align: center;">&copy; 2026 Maa Mansa Devi Property. All rights reserved.</p>
            </div>
        `;

        // Using Google Apps Script Proxy (Same as pbtadka)
        const response = await axios.post(GOOGLE_SCRIPT_URL, null, {
            params: {
                to: email,
                subject: subject,
                message: message
            }
        });

        if (response.data && response.data.success) {
            console.log(`OTP sent successfully to ${email} via Google Proxy`);
            return true;
        } else {
            console.error('Google Proxy error:', response.data?.error || 'Unknown error');
            return false;
        }
    } catch (error) {
        console.error('Email Service Error:', error.message);
        return false;
    }
};

export const sendNotification = async (subject, htmlContent) => {
    const adminEmail = process.env.ADMIN_EMAIL || 'digitalorra.developer5@gmail.com';
    try {
        const response = await axios.post(GOOGLE_SCRIPT_URL, null, {
            params: {
                to: adminEmail,
                subject: subject,
                message: htmlContent
            }
        });

        if (response.data && response.data.success) {
            console.log(`Admin Notification sent successfully to ${adminEmail}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Admin Notification Error:', error.message);
        return false;
    }
};
