import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Point name is required',
    }).min(1, 'Point name is required'),
    description: z.string().optional(),
    points: z.number({
      required_error: 'Points value is required',
    }).positive('Points must be positive'),
  }),
});

const updateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Point name is required').optional(),
    description: z.string().optional(),
    points: z.number().positive('Points must be positive').optional(),
  }),
  params: z.object({
    id: z.string({
      required_error: 'Point ID is required',
    }),
  }),
});

const deleteSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Point ID is required',
    }),
  }),
});

const getSingleSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Point ID is required',
    }),
  }),
});

export const PointValidation = {
  createSchema,
  updateSchema,
  deleteSchema,
  getSingleSchema,
};