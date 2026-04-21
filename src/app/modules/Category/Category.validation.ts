import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Category name is required',
    }).min(1, 'Category name is required'),
    description: z.string().optional(),
    icon: z.string().optional(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required').optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
  }),
  params: z.object({
    id: z.string({
      required_error: 'Category ID is required',
    }),
  }),
});

const deleteSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Category ID is required',
    }),
  }),
});

const getSingleSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Category ID is required',
    }),
  }),
});

export const categoryValidation = {
  createSchema,
  updateSchema,
  deleteSchema,
  getSingleSchema,
};