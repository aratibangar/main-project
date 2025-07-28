import * as z from "zod";

export const SignupVal = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(60, { message: "Name must be less than 60 characters." }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(20, { message: "Username must be less than 20 characters." })
    .regex(/^[a-zA-Z0-9._ -]+$/, {
      message:
        "Username can only contain letters, numbers, underscores, dashes, periods, and no spaces.",
    }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }).max(20, { message: "Password must be less than 20 characters." }),
  role: z.enum(["ROLE_USER", "ROLE_ADMIN"], { message: "Role must be either 'user' or 'admin'." }),
  key: z.string()
});

export const SigninVal = z.object({
  username: z.string(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(20, { message: "Password must be less than 20 characters." }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
      message: `Password must include:At least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character from @$!%*?&`,
    }),
});
