import Enquiry from '../models/enquiryModel.js';
import Notification from '../models/notificationModel.js';
import Property from '../models/propertyModel.js';
import { sendNotification } from '../utils/emailService.js';
import fs from 'fs';

// @desc    Create new enquiry
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = async (req, res) => {
  try {
    fs.appendFileSync('debug.log', `Enquiry Request: ${JSON.stringify(req.body)}\n`);
    const { property, name, email, phone, message } = req.body;

    const enquiry = new Enquiry({
      user: req.user ? req.user._id : null,
      property,
      name,
      email,
      phone,
      message,
    });

    const createdEnquiry = await enquiry.save();

    // Create notification for admin (don't block enquiry if notification fails)
    try {
      let propertyIdStr = 'General Enquiry';
      if (property) {
        const propData = await Property.findById(property);
        if (propData) {
          propertyIdStr = propData.propertyId || propData._id.toString().substring(0, 8).toUpperCase();
        }
      }

      await Notification.create({
        user: req.user ? req.user._id : null,
        property: property,
        enquiry: createdEnquiry._id,
        message: `New enquiry from ${name}${property ? ` (Property ID: ${propertyIdStr})` : ' (General)'}`,
        type: 'EnquiryAdded'
      });

      // Send Email Notification
      const subject = `MMD Alert: New Enquiry ${propertyIdStr} from ${name}`;
      const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 0; color: #333; background-color: #f8fafc; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; max-width: 600px;">
          <div style="background-color: #0f172a; padding: 25px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 1px;">Maa Mansa Devi Property</h2>
            <p style="color: #94a3b8; margin: 5px 0 0; font-size: 12px; text-transform: uppercase; font-weight: bold;">New Enquiry Notification</p>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <div style="margin-bottom: 25px; border-bottom: 2px solid #f1f5f9; pb: 15px;">
              <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;">Property Context</p>
              <h3 style="margin: 5px 0; color: #2563eb; font-size: 18px; font-weight: bold;">${propertyIdStr}</h3>
            </div>
            
            <div style="display: grid; gap: 15px;">
              <p><strong>Lead Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Message:</strong></p>
              <div style="background-color: #f1f5f9; padding: 15px; border-radius: 12px; font-style: italic; color: #475569;">
                "${message}"
              </div>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 11px; color: #94a3b8;">&copy; 2026 Maa Mansa Devi Property Management System</p>
            <p style="margin: 5px 0 0; font-size: 10px; color: #cbd5e1;">Property Portal Admin Alert</p>
          </div>
        </div>
      `;
      sendNotification(subject, htmlContent);
    } catch (notificationError) {
      console.error('Notification Error:', notificationError.message);
    }

    res.status(201).json(createdEnquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
export const getEnquiries = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Enquiry.countDocuments({});
    const enquiries = await Enquiry.find({})
      .populate('property', 'title price images city location')
      .populate('user', 'name email')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ enquiries, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my enquiries
// @route   GET /api/enquiries/my
// @access  Private
export const getMyEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ user: req.user._id })
      .populate('property', 'title price images city location')
      .sort({ createdAt: -1 });

    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
export const updateEnquiryStatus = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
      enquiry.status = req.body.status || enquiry.status;
      enquiry.adminNotes = req.body.adminNotes || enquiry.adminNotes;

      const updatedEnquiry = await enquiry.save();
      res.json(updatedEnquiry);
    } else {
      res.status(404).json({ message: 'Enquiry not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
      await enquiry.deleteOne();
      res.json({ message: 'Enquiry removed' });
    } else {
      res.status(404).json({ message: 'Enquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
