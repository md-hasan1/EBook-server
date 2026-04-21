
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { notificationServices } from "./Notification.service";


const sendNotification = catchAsync(async (req: any, res: any) => {
  const { userId } = req.params;
  const { title, body } = req.body;
  const notification = await notificationServices.sendSingleNotification(userId,title, body,req.user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "notification sent successfully",
    data: notification,
  });
});

const sendNotifications = catchAsync(async (req: any, res: any) => {
  const notifications = await notificationServices.sendNotifications(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "notifications sent successfully",
    data: notifications,
  });
});

const getNotifications = catchAsync(async (req: any, res: any) => {
  const notifications = await notificationServices.getNotificationsFromDB(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notifications retrieved successfully",
    data: notifications,
  });
});

const getSingleNotificationById = catchAsync(async (req: any, res: any) => {
  const notificationId = req.params.notificationId;
  const notification = await notificationServices.getSingleNotificationFromDB(
    req,
    notificationId
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Notification retrieved successfully",
    data: notification,
  });
});

export const notificationController = {
  sendNotification,
  sendNotifications,
  getNotifications,
  getSingleNotificationById,
};
