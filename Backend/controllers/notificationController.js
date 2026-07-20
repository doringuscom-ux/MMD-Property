import Notification from '../models/notificationModel.js';

// @desc    Get all notifications (Admin)
// @route   GET /api/notifications
// @access  Private/SubAdmin
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            $or: [
                { recipient: null },
                { recipient: { $exists: false } }
            ]
        })
            .populate('user', 'name email avatar')
            .populate('property', 'title propertyId')
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get notifications for logged-in user
// @route   GET /api/notifications/my
// @access  Private
export const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('property', 'title propertyId')
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification) {
            notification.isRead = true;
            await notification.save();
            res.json({ message: 'Notification marked as read' });
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark all admin notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private/SubAdmin
export const markAllNotificationsRead = async (req, res) => {
    try {
        await Notification.updateMany({ 
            isRead: false,
            $or: [
                { recipient: null },
                { recipient: { $exists: false } }
            ]
        }, { isRead: true });
        res.json({ message: 'All admin notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark all user notifications as read
// @route   PUT /api/notifications/my/read-all
// @access  Private
export const markMyNotificationsRead = async (req, res) => {
    try {
        await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
        res.json({ message: 'All user notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification) {
            await notification.deleteOne();
            res.json({ message: 'Notification removed' });
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
