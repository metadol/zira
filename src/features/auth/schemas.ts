import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .pipe(z.email("Invalid email address")),
    password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z
        .string()
        .min(1, "Email is required")
        .pipe(z.email("Invalid email address")),
    password: z.string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(256, "Password must be less than 256 characters"),
});