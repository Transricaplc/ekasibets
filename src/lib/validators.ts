import { z } from "zod";

// SA ID number validation (13 digits, basic Luhn check)
const validateSAID = (id: string): boolean => {
  if (!/^\d{13}$/.test(id)) return false;
  // Date validity (YYMMDD)
  const yy = parseInt(id.slice(0, 2), 10);
  const mm = parseInt(id.slice(2, 4), 10);
  const dd = parseInt(id.slice(4, 6), 10);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return false;
  // Luhn
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    let digit = parseInt(id[i], 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

export const signUpSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name too short").max(50),
    lastName: z.string().trim().min(2, "Last name too short").max(50),
    email: z.string().trim().email("Invalid email").max(255),
    phone: z
      .string()
      .trim()
      .regex(/^(\+27|0)[0-9]{9}$/, "Use SA format: 0XXXXXXXXX or +27XXXXXXXXX"),
    idNumber: z
      .string()
      .trim()
      .refine(validateSAID, "Invalid SA ID number"),
    dateOfBirth: z.string().refine((d) => {
      const dob = new Date(d);
      if (isNaN(dob.getTime())) return false;
      const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 3600 * 1000);
      return age >= 18 && age < 120;
    }, "You must be 18 or older"),
    password: z
      .string()
      .min(8, "Min 8 characters")
      .max(72)
      .regex(/[A-Z]/, "Needs an uppercase letter")
      .regex(/[0-9]/, "Needs a number"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms" }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
