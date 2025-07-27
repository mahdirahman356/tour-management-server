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
exports.TourServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const constants_1 = require("../../constants");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const division_model_1 = require("../division/division.model");
const tour_model_1 = require("./tour.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_model_1.TourType.create(payload);
    return tourType;
});
const getAllTourType = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.TourType.find(), query);
    const tourType = yield queryBuilder
        .search(constants_1.tourTypeSearchableFilds)
        .filter()
        .sort()
        .fields()
        .build();
    const meta = yield queryBuilder.getMeta();
    return {
        data: tourType,
        meta: meta
    };
});
const getSingleTourType = (tourTypeId) => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_model_1.TourType.findOne({ _id: tourTypeId });
    if (!tourType) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour Type Not Found");
    }
    return tourType;
});
const updateTourType = (tourTypeId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedTourType = yield tour_model_1.TourType.findByIdAndUpdate(tourTypeId, payload, { new: true, runValidators: true });
    if (!updatedTourType) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour Type Not Found");
    }
    return updatedTourType;
});
const deleteTourType = (tourTypeId) => __awaiter(void 0, void 0, void 0, function* () {
    const isLinked = yield tour_model_1.Tour.exists({ tourType: tourTypeId });
    if (isLinked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot delete. Tours are linked to this tour type.");
    }
    const tourType = yield tour_model_1.TourType.findByIdAndDelete(tourTypeId);
    if (!tourType) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour Type Not Found");
    }
    return tourType;
});
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { division, tourType } = payload;
    const existingTour = yield tour_model_1.Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }
    const isDevisionExist = yield division_model_1.Division.findById(division);
    const isTourTypeExist = yield tour_model_1.TourType.findById(tourType);
    if (!isDevisionExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Devision Not Found");
    }
    if (!isTourTypeExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour Type Not Found");
    }
    const tour = yield tour_model_1.Tour.create(payload);
    return tour;
});
const getAllTour = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = yield queryBuilder
        .search(constants_1.tourSearchableFilds)
        .filter()
        .sort()
        .fields()
        .paginate()
        .build();
    const meta = yield queryBuilder.getMeta();
    return {
        data: tours,
        meta: meta
    };
});
const getSingleTour = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tour_model_1.Tour.findOne({ slug });
    if (!tour) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour Not Found");
    }
    return tour;
});
const updateTour = (tourId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { division, tourType } = payload;
    const existingTour = yield tour_model_1.Tour.findById(tourId);
    if (!existingTour) {
        throw new Error("Tour not found.");
    }
    if (division) {
        const isDivisionExist = yield division_model_1.Division.findById(division);
        if (!isDivisionExist) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Division Not Found");
        }
    }
    if (tourType) {
        const isTourTypeExist = yield tour_model_1.TourType.findById(tourType);
        if (!isTourTypeExist) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour Type Not Found");
        }
    }
    if (payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0) {
        payload.images = [...payload.images, ...existingTour.images];
    }
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        const restDBImages = existingTour.images.filter((imageUrl) => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); });
        const updatedPayloadImages = (payload.images || [])
            .filter(imageUrl => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); })
            .filter(imageUrl => !restDBImages.includes(imageUrl));
        payload.images = [...restDBImages, ...updatedPayloadImages];
    }
    const updatedTour = yield tour_model_1.Tour.findByIdAndUpdate(tourId, payload, { new: true, runValidators: true });
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        yield Promise.all(payload.deleteImages.map(url => (0, cloudinary_config_1.deleteImageFromCLoudinary)(url)));
    }
    return updatedTour;
});
const deleteTour = (tourId) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tour_model_1.Tour.findByIdAndDelete(tourId);
    if (!tour) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No Tour Found");
    }
    return tour;
});
exports.TourServices = {
    createTourType,
    getAllTourType,
    getSingleTourType,
    updateTourType,
    deleteTourType,
    createTour,
    getAllTour,
    getSingleTour,
    updateTour,
    deleteTour
};
