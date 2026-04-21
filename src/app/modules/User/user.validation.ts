import { z } from "zod";

const registerValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),
    name: z.string().optional(),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, "Password must be at least 8 characters long"),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, "Password must be at least 8 characters long"),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    promoCode: z.string().optional(),
    profession: z.string().optional(),
    profileImage: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").optional(),
    name: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    promoCode: z.string().optional(),
    profession: z.string().optional(),
    profileImage: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(['admin', 'user']).optional(),
  }),
  params: z.object({
    id: z.string({
      required_error: "User ID is required",
    }),
  }),
});

const blockUserSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "User ID is required",
    }),
  }),
});

const toggleStatusSchema = z.object({
  body: z.object({
    notificationsEnabled: z.boolean().optional(),
  }),
});

const deleteUserSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "User ID is required",
    }),
  }),
});

const deleteManySchema = z.object({
  body: z.object({
    ids: z.array(z.string(), {
      required_error: "User IDs are required",
    }).min(1, "At least one user ID is required"),
  }),
});

export const UserValidation = {
  registerValidationSchema,
  loginValidationSchema,
  updateProfileSchema,
  updateUserSchema,
  blockUserSchema,
  toggleStatusSchema,
  deleteUserSchema,
  deleteManySchema,
};

// Backward compatibility
export const CreateUserValidationSchema = registerValidationSchema;
export const UserLoginValidationSchema = loginValidationSchema;
export const userUpdateSchema = updateProfileSchema;
