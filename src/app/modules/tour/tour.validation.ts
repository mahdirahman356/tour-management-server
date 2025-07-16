import mongoose from "mongoose";
import z from "zod";


export const createTourTypeZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Tour Type name must be string" })
        .min(2, { message: "Division name must be at least 2 characters long" })
        .max(50, { message: "Division name cannot exceed 50 characters." }),
})

export const updateTourTypeZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Tour Type name must be string" })
        .min(2, { message: "Division name must be at least 2 characters long" })
        .max(50, { message: "Division name cannot exceed 50 characters." })
        .optional(),
})


const objectId = z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId",
});

export const createTourZodSchema = z.object({
  title: z
    .string({ invalid_type_error: "Title must be a string" })
    .min(3, "Title must be at least 3 characters long"),

  slug: z
    .string({ invalid_type_error: "Slug must be a string" })
    .min(3, "Slug must be at least 3 characters long"),

  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .optional(),

  images: z
    .array(z.string().url({ message: "Each image must be a valid URL" }))
    .optional(),

  location: z
    .string({ invalid_type_error: "Location must be a string" })
    .optional(),

  costFrom: z
    .number({ invalid_type_error: "Cost must be a number" })
    .nonnegative({ message: "Cost must be positive" })
    .optional(),

  startDate: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), { message: "Invalid start date" })
    .optional(),

  endDate: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), { message: "Invalid end date" })
    .optional(),

  included: z
    .array(z.string({ invalid_type_error: "Included items must be strings" }))
    .optional(),

  excluded: z
    .array(z.string({ invalid_type_error: "Excluded items must be strings" }))
    .optional(),

  amenities: z
    .array(z.string({ invalid_type_error: "Amenities must be strings" }))
    .optional(),

  tourPlan: z
    .array(z.string({ invalid_type_error: "Tour plan items must be strings" }))
    .optional(),

  maxGuest: z
    .number({ invalid_type_error: "Max guest must be a number" })
    .int()
    .positive()
    .optional(),

  minAge: z
    .number({ invalid_type_error: "Minimum age must be a number" })
    .int()
    .positive()
    .optional(),

  division: objectId,
  tourType: objectId,
});

export const updateTourZodSchema = z.object({
  title: z
    .string({ invalid_type_error: "Title must be a string" })
    .min(3, "Title must be at least 3 characters long")
    .optional(),

  slug: z
    .string({ invalid_type_error: "Slug must be a string" })
    .min(3, "Slug must be at least 3 characters long")
     .optional(),

  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .optional(),

  images: z
    .array(z.string().url({ message: "Each image must be a valid URL" }))
    .optional(),

  location: z
    .string({ invalid_type_error: "Location must be a string" })
    .optional(),

  costFrom: z
    .number({ invalid_type_error: "Cost must be a number" })
    .nonnegative({ message: "Cost must be positive" })
    .optional(),

  startDate: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), { message: "Invalid start date" })
    .optional(),

  endDate: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), { message: "Invalid end date" })
    .optional(),

  included: z
    .array(z.string({ invalid_type_error: "Included items must be strings" }))
    .optional(),

  excluded: z
    .array(z.string({ invalid_type_error: "Excluded items must be strings" }))
    .optional(),

  amenities: z
    .array(z.string({ invalid_type_error: "Amenities must be strings" }))
    .optional(),

  tourPlan: z
    .array(z.string({ invalid_type_error: "Tour plan items must be strings" }))
    .optional(),

  maxGuest: z
    .number({ invalid_type_error: "Max guest must be a number" })
    .int()
    .positive()
    .optional(),

  minAge: z
    .number({ invalid_type_error: "Minimum age must be a number" })
    .int()
    .positive()
    .optional(),

  division: objectId.optional(),
  tourType: objectId.optional(),
});