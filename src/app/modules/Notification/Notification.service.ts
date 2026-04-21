import { resolveRuntimeExtensions } from "@aws-sdk/client-s3/dist-types/runtimeExtensions";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import admin from "./firebaseAdmin";

// Send notification to a single user
const sendSingleNotification = async (
  userId: string,
  title: string,
  body: string,
  sender: string
) => {
  try {
    if (!title || !body) {
      throw new ApiError(400, "Title and body are required");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user || !user.fcmToken) {
      return { massage: "FCM token not found" };
    }

    const message = {
      notification: {
        title,
        body,
      },
      token: user.fcmToken,
    };

    await prisma.notification.create({
      data: {
        receiverId: userId,
        senderId: sender,
        title,
        body,
      },
    });

    const response = await admin.messaging().send(message);
    return response;
  } catch (error: any) {
    console.error("Error sending notification:", error);
    if (error.code === "messaging/invalid-registration-token") {
      throw new ApiError(400, "Invalid FCM registration token");
    } else if (error.code === "messaging/registration-token-not-registered") {
      throw new ApiError(404, "FCM token is no longer registered");
    } else {
      throw new ApiError(500, error.message || "Failed to send notification");
    }
  }
};

// Send notifications to all users with valid FCM tokens
 const sendNotifications = async (req: any) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      throw new ApiError(400, "Title and body are required");
    }

    // Step 1: Fetch users with non-null/non-empty FCM tokens
    const users = await prisma.user.findMany({
      where: {
        fcmToken: {
          notIn: ["", " "],
          not: null,
        },
      },
      select: {
        id: true,
        fcmToken: true,
      },
    });

    // Step 2: Filter users again in runtime to enforce safety (TypeScript type narrowing)
    const validUsers = users.filter(
      (user): user is { id: string; fcmToken: string } =>
        typeof user.fcmToken === "string" && user.fcmToken.trim().length > 0
    );

    if (validUsers.length === 0) {
      return
    }

    const fcmTokens = validUsers.map((user) => user.fcmToken);

    // Step 3: Create the notification payload
    const message = {
      notification: {
        title,
        body,
      },
      tokens: fcmTokens,
    };

    // Step 4: Send the notifications using Firebase
    const response = await admin.messaging().sendEachForMulticast(message as any);

    // Step 5: Find successful sends
    const successIndices = response.responses
      .map((res, idx) => (res.success ? idx : null))
      .filter((idx): idx is number => idx !== null);

    const successfulUsers = successIndices.map((idx) => validUsers[idx]);

    // Step 6: Record successful notifications in DB
    const notificationData = successfulUsers.map((user) => ({
      receiverId: user.id,
      senderId: req.user?.id, // 👈 Optional chaining in case user is missing
      title,
      body,
    }));

    await prisma.notification.createMany({
      data: notificationData,
    });

    // Step 7: Collect failed tokens
    const failedTokens = response.responses
      .map((res, idx) => (!res.success ? fcmTokens[idx] : null))
      .filter((token): token is string => token !== null);

    // Step 8: Return result
    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      failedTokens,
    };
  } catch (error: any) {
    throw new ApiError(500, error.message || "Failed to send notifications");
  }
};
// Fetch notifications for the current user
// Fetch notifications for the current user
const getNotificationsFromDB = async (req: any) => {
  try {
    const userId = req.user.id;

    // Validate user ID
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    // Fetch notifications for the current user
    const notifications = await prisma.notification.findMany({
      where: {
        receiverId: userId,
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Check if notifications exist

    // Return formatted notifications
    return notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      sender: {
        id: notification.sender.id,
        fullName: notification.sender.fullName,
        phoneNumber: notification.sender.phoneNumber,
        profileImage: notification.sender.profileImage,
      },
    }));
  } catch (error: any) {
    throw new ApiError(500, error.message || "Failed to fetch notifications");
  }
};

// Fetch a single notification and mark it as read
const getSingleNotificationFromDB = async (
  req: any,
  notificationId: string
) => {
  try {
    const userId = req.user.id;

    // Validate user and notification ID
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    if (!notificationId) {
      throw new ApiError(400, "Notification ID is required");
    }

    // Fetch the notification
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        receiverId: userId,
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            profileImage: true,
          },
        },
      },
    });

    // Mark the notification as read
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            profileImage: true,
          },
        },
      },
    });

    // Return the updated notification
    return {
      id: updatedNotification.id,
      title: updatedNotification.title,
      body: updatedNotification.body,
      isRead: updatedNotification.isRead,
      createdAt: updatedNotification.createdAt,
      sender: {
        id: updatedNotification.sender.id,
        fullName: updatedNotification.sender.fullName,
        phoneNumber: updatedNotification.sender.phoneNumber,
        profileImage: updatedNotification.sender.profileImage,
      },
    };
  } catch (error: any) {
    throw new ApiError(500, error.message || "Failed to fetch notification");
  }
};

export const notificationServices = {
  sendSingleNotification,
  sendNotifications,
  getNotificationsFromDB,
  getSingleNotificationFromDB,
};
