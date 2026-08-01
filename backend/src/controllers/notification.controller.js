import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getPaginateOptions, getPaginationMeta } from '../utils/paginate.js';
import Notification from '../models/Notification.js';

export const getMyNotifications = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort, filter } = getPaginateOptions(req, { searchFields: ['title', 'message'] });
  filter.user = req.user._id;
  if (req.query.unread === 'true') filter.isRead = false;
  const total = await Notification.countDocuments(filter);
  const items = await Notification.find(filter).sort(sort).skip(skip).limit(limit).lean();
  const unread = await Notification.countDocuments({ user: req.user._id, isRead: false });
  res.status(200).json(new ApiResponse(200, { items, unread, pagination: getPaginationMeta(page, limit, total) }, 'Notifications retrieved'));
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, 'Notification not found');
  res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read'));
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
});

export const createNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.create(req.body);
  res.status(201).json(new ApiResponse(201, notification, 'Notification created'));
});

export const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.status(200).json(new ApiResponse(200, null, 'Notification deleted'));
});

export const clearAll = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ user: req.user._id });
  res.status(200).json(new ApiResponse(200, null, 'All notifications cleared'));
});
