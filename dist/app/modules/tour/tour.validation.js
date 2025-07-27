"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTourZodSchema = exports.createTourZodSchema = exports.updateTourTypeZodSchema = exports.createTourTypeZodSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = __importDefault(require("zod"));
exports.createTourTypeZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Tour Type name must be string" })
        .min(2, { message: "Division name must be at least 2 characters long" })
        .max(50, { message: "Division name cannot exceed 50 characters." }),
});
exports.updateTourTypeZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Tour Type name must be string" })
        .min(2, { message: "Division name must be at least 2 characters long" })
        .max(50, { message: "Division name cannot exceed 50 characters." })
        .optional(),
});
const objectId = zod_1.default.string().refine(val => mongoose_1.default.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});
exports.createTourZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({ invalid_type_error: "Title must be a string" })
        .min(3, "Title must be at least 3 characters long"),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be a string" })
        .optional(),
    images: zod_1.default
        .array(zod_1.default.string().url({ message: "Each image must be a valid URL" }))
        .optional(),
    location: zod_1.default
        .string({ invalid_type_error: "Location must be a string" })
        .optional(),
    costFrom: zod_1.default
        .number({ invalid_type_error: "Cost must be a number" })
        .nonnegative({ message: "Cost must be positive" })
        .optional(),
    startDate: zod_1.default
        .string()
        .refine(val => !isNaN(Date.parse(val)), { message: "Invalid start date" })
        .optional(),
    departureLocation: zod_1.default
        .string({ invalid_type_error: "DepartureLocation must be a number" })
        .optional(),
    arrivalLocation: zod_1.default
        .string({ invalid_type_error: "ArrivalLocation must be a number" })
        .optional(),
    endDate: zod_1.default
        .string()
        .refine(val => !isNaN(Date.parse(val)), { message: "Invalid end date" })
        .optional(),
    included: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Included items must be strings" }))
        .optional(),
    excluded: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Excluded items must be strings" }))
        .optional(),
    amenities: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Amenities must be strings" }))
        .optional(),
    tourPlan: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Tour plan items must be strings" }))
        .optional(),
    maxGuest: zod_1.default
        .number({ invalid_type_error: "Max guest must be a number" })
        .int()
        .positive()
        .optional(),
    minAge: zod_1.default
        .number({ invalid_type_error: "Minimum age must be a number" })
        .int()
        .positive()
        .optional(),
    division: objectId,
    tourType: objectId,
});
exports.updateTourZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({ invalid_type_error: "Title must be a string" })
        .min(3, "Title must be at least 3 characters long")
        .optional(),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be a string" })
        .optional(),
    images: zod_1.default
        .array(zod_1.default.string().url({ message: "Each image must be a valid URL" }))
        .optional(),
    location: zod_1.default
        .string({ invalid_type_error: "Location must be a string" })
        .optional(),
    costFrom: zod_1.default
        .number({ invalid_type_error: "Cost must be a number" })
        .nonnegative({ message: "Cost must be positive" })
        .optional(),
    startDate: zod_1.default
        .string()
        .refine(val => !isNaN(Date.parse(val)), { message: "Invalid start date" })
        .optional(),
    departureLocation: zod_1.default
        .string({ invalid_type_error: "DepartureLocation must be a number" })
        .optional(),
    arrivalLocation: zod_1.default
        .string({ invalid_type_error: "ArrivalLocation must be a number" })
        .optional(),
    endDate: zod_1.default
        .string()
        .refine(val => !isNaN(Date.parse(val)), { message: "Invalid end date" })
        .optional(),
    included: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Included items must be strings" }))
        .optional(),
    excluded: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Excluded items must be strings" }))
        .optional(),
    amenities: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Amenities must be strings" }))
        .optional(),
    tourPlan: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Tour plan items must be strings" }))
        .optional(),
    maxGuest: zod_1.default
        .number({ invalid_type_error: "Max guest must be a number" })
        .int()
        .positive()
        .optional(),
    minAge: zod_1.default
        .number({ invalid_type_error: "Minimum age must be a number" })
        .int()
        .positive()
        .optional(),
    division: objectId.optional(),
    tourType: objectId.optional(),
    deleteImages: zod_1.default.array(zod_1.default.string()).optional()
});
