"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const constants_1 = require("../../constants");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const tour_model_1 = require("../tour/tour.model");
const division_model_1 = require("./division.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createDivision = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDivision = yield division_model_1.Division.findOne({ name: payload.name });
    if (existingDivision) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "A division with this name already exist");
    }
    const division = yield division_model_1.Division.create(payload);
    return division;
});
const updateDivision = (divisionId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDivision = yield division_model_1.Division.findById(divisionId);
    if (!existingDivision) {
        throw new Error("Division not found.");
    }
    const duplicateDivision = yield division_model_1.Division.findOne({
        name: payload.name,
        _id: { $ne: divisionId },
    });
    if (duplicateDivision) {
        throw new Error("A division with this name already exists.");
    }
    const updatedDivision = yield division_model_1.Division.findByIdAndUpdate(divisionId, payload, { new: true, runValidators: true });
    if (payload.thumbnail && existingDivision.thumbnail) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(existingDivision.thumbnail);
    }
    return updatedDivision;
});
const getAllDivision = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(division_model_1.Division.find(), query);
    const division = yield queryBuilder
        .search(constants_1.divisionSearchableFilds)
        .filter()
        .sort()
        .fields()
        .paginate()
        .build();
    const meta = yield queryBuilder.getMeta();
    return {
        data: division,
        meta: meta
    };
});
const getSingleDivision = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const division = yield division_model_1.Division.findOne({ slug });
    if (!division) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Division Not Found");
    }
    return division;
});
const deleteDivision = (divisionId) => __awaiter(void 0, void 0, void 0, function* () {
    const isLinked = yield tour_model_1.Tour.exists({ division: divisionId });
    if (isLinked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot delete. Tours are linked to this division.");
    }
    const deletedDivision = yield division_model_1.Division.findByIdAndDelete(divisionId);
    if (!deletedDivision) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Division Not Found");
    }
    return deletedDivision;
});
exports.DivisionServices = {
    createDivision,
    updateDivision,
    getAllDivision,
    deleteDivision,
    getSingleDivision
};
