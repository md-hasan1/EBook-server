import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }).min(1, 'Name is required'),
    description: z.string().optional(),
    image: z.string().optional(),
    isActive: z.boolean().optional().default(true),
  }),
});

const updateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string({
      required_error: 'ID is required',
    }),
  }),
});

const deleteSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'ID is required',
    }),
  }),
});

const getSingleSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'ID is required',
    }),
  }),
});

export const BannerValidation = {
  createSchema,
  updateSchema,
  deleteSchema,
  getSingleSchema,
};