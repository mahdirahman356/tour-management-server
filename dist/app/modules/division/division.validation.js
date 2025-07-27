"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDivisionZodSchema = exports.createDivisionZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createDivisionZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Division name must be string" })
        .min(2, { message: "Division name must be at least 2 characters long" })
        .max(50, { message: "Division name cannot exceed 50 characters." }),
    thumbnail: zod_1.default.string({ invalid_type_error: "thumbnail must be string" }).optional(),
    description: zod_1.default.string({ invalid_type_error: "Description must be string" }).optional(),
});
exports.updateDivisionZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Division name must be string" })
        .min(2, { message: "Division name must be at least 2 characters long" })
        .max(50, { message: "Division name cannot exceed 50 characters." })
        .optional(),
    thumbnail: zod_1.default.string({ invalid_type_error: "thumbnail must be string" })
        .optional(),
    description: zod_1.default.string({ invalid_type_error: "Description must be string" })
        .optional(),
});
