import { z } from "zod";

// Option 1: Using the new v4 standalone z.email() (if using Zod v4)
export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(256, "Password must be less than 256 characters"),
});