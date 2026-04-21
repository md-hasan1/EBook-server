import { z } from "zod";

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
      .min(6, "Password must be at least 6 characters"),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z
      .string({
        required_error: "Old password is required",
      })
      .min(6, "Password must be at least 6 characters"),
    newPassword: z
      .string({
        required_error: "New password is required",
      })
      .min(6, "Password must be at least 6 characters"),
  }),
});

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),
    otp: z
      .string({
        required_error: "OTP is required",
      })
      .length(6, "OTP must be 6 digits"),
    newPassword: z
      .string({
        required_error: "New password is required",
      })
      .min(6, "Password must be at least 6 characters"),
  }),
});

const verifyOtpValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),
    otp: z
      .string({
        required_error: "OTP is required",
      })
      .length(6, "OTP must be 6 digits"),
  }),
});

const resendOtpValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),
  }),
});

export const authValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
  verifyOtpValidationSchema,
  resendOtpValidationSchema,
};