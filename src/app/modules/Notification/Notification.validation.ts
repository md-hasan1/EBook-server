import { z } from 'zod';

const sendNotificationSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: 'User ID is required',
    }).optional(),
    title: z.string({
      required_error: 'Notification title is required',
    }).min(1, 'Title is required'),
    message: z.string({
      required_error: 'Notification message is required',
    }).min(1, 'Message is required'),
    type: z.enum(['info', 'warning', 'error', 'success']).optional(),
    data: z.object({}).passthrough().optional(),
  }),
  params: z.object({
    userId: z.string().optional(),
  }).optional(),
});

const getSingleSchema = z.object({
  params: z.object({
    notificationId: z.string({
      required_error: 'Notification ID is required',
    }),
  }),
});

const updateSchema = z.object({
  body: z.object({
    isRead: z.boolean().optional(),
    title: z.string().optional(),
    message: z.string().optional(),
  }),
  params: z.object({
    notificationId: z.string({
      required_error: 'Notification ID is required',
    }),
  }),
});

const deleteSchema = z.object({
  params: z.object({
    notificationId: z.string({
      required_error: 'Notification ID is required',
    }),
  }),
});

export const NotificationValidation = {
  sendNotificationSchema,
  getSingleSchema,
  updateSchema,
  deleteSchema,
};