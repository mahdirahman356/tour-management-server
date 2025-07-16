import z from "zod";


export const createDivisionZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Division name must be string" })
        .min(2, { message: "Division name must be at least 2 characters long" })
        .max(50, { message: "Division name cannot exceed 50 characters." }),
    slug: z
        .string({ invalid_type_error: "Slug must be string" })
        .min(2, { message: "Slug must be at least 2 characters long" })
        .max(50, { message: "Slug cannot exceed 50 characters." }),
    thumbnail: z.string({ invalid_type_error: "thumbnail must be string" }),
    description:  z.string({ invalid_type_error: "Description must be string" }),

})

export const updateDivisionZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Division name must be string" })
        .min(2, { message: "Division name must be at least 2 characters long" })
        .max(50, { message: "Division name cannot exceed 50 characters." })
        .optional(),
    slug: z
        .string({ invalid_type_error: "Slug must be string" })
        .min(2, { message: "Slug must be at least 2 characters long" })
        .max(50, { message: "Slug cannot exceed 50 characters." })
        .optional(),
    thumbnail: z.string({ invalid_type_error: "thumbnail must be string" })
    .optional(),
    description:  z.string({ invalid_type_error: "Description must be string" })
    .optional(),

})