import { z } from 'zod';

const toggleSchema = z.object({
  body: z.object({
    bookId: z.string({
      required_error: 'Book ID is required',
    }),
  }),
});

const deleteSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Favorite ID is required',
    }),
  }),
});

const getSingleSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Favorite ID is required',
    }),
  }),
});

export const favouriteValidation = {
  toggleSchema,
  deleteSchema,
  getSingleSchema,
};
