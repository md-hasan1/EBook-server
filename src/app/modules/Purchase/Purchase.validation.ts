import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    bookId: z.string({
      required_error: 'Book ID is required',
    }),
    price: z.number({
      required_error: 'Price is required',
    }).positive('Price must be positive'),
    paymentMethod: z.enum(['card', 'wallet', 'points']).optional(),
    transactionId: z.string().optional(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'completed', 'failed', 'refunded']).optional(),
    price: z.number().positive('Price must be positive').optional(),
  }),
  params: z.object({
    id: z.string({
      required_error: 'Purchase ID is required',
    }),
  }),
});

const deleteSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Purchase ID is required',
    }),
  }),
});

const getSingleSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Purchase ID is required',
    }),
  }),
});

const pinPurchaseSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Purchase ID is required',
    }),
  }),
});

export const PurchaseValidation = {
  createSchema,
  updateSchema,
  deleteSchema,
  getSingleSchema,
  pinPurchaseSchema,
};