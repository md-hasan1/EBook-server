import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Redeem name is required',
    }).min(1, 'Redeem name is required'),
    description: z.string().optional(),
    pointsRequired: z.number({
      required_error: 'Points required is required',
    }).positive('Points required must be positive'),
  }),
});

const updateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Redeem name is required').optional(),
    description: z.string().optional(),
    pointsRequired: z.number().positive('Points required must be positive').optional(),
  }),
  params: z.object({
    id: z.string({
      required_error: 'Redeem ID is required',
    }),
  }),
});

const deleteSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Redeem ID is required',
    }),
  }),
});

const getSingleSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Redeem ID is required',
    }),
  }),
});

const usePointSchema = z.object({
  body: z.object({
    bookId: z.string({
      required_error: 'Book ID is required',
    }),
    points: z.number({
      required_error: 'Points to redeem is required',
    }).positive('Points must be positive'),
  }),
});

export const RedeemValidation = {
  createSchema,
  updateSchema,
  deleteSchema,
  getSingleSchema,
  usePointSchema,
};