import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Book name is required',
    }).min(1, 'Book name is required'),
    description: z.string().optional(),
    author: z.string().optional(),
    price: z.number({
      required_error: 'Price is required',
    }).positive('Price must be positive'),
    categoryId: z.string().optional(),
    image: z.string().optional(),
    publishedDate: z.string().optional(),
    pages: z.number().optional(),
    isbn: z.string().optional(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Book name is required').optional(),
    description: z.string().optional(),
    author: z.string().optional(),
    price: z.number().positive('Price must be positive').optional(),
    categoryId: z.string().optional(),
    image: z.string().optional(),
    publishedDate: z.string().optional(),
    pages: z.number().optional(),
    isbn: z.string().optional(),
  }),
  params: z.object({
    id: z.string({
      required_error: 'Book ID is required',
    }),
  }),
});

const deleteSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Book ID is required',
    }),
  }),
});

const getSingleSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Book ID is required',
    }),
  }),
});

const addRecommendedSchema = z.object({
  body: z.object({
    bookId: z.string({
      required_error: 'Book ID is required',
    }),
  }),
});

const deleteRecommendedSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Recommended book ID is required',
    }),
  }),
});

export const BookValidation = {
  createSchema,
  updateSchema,
  deleteSchema,
  getSingleSchema,
  addRecommendedSchema,
  deleteRecommendedSchema,
};