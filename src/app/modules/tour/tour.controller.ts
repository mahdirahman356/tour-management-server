/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { TourServices } from "./tour.service";
import { Types } from "mongoose";
import { ITour } from "./tour.interface";


const createTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const tourType = await TourServices.createTourType(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Tour Type Created Successfully",
        data: tourType
    })
})

const getAllTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query
    const tourType = await TourServices.getAllTourType(query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Tour Type Retrieved Successfully",
        data: tourType.data,
        meta: tourType.meta 
    })
})
const getSingleTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const tourType = await TourServices.getSingleTourType(req.params.id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Tour Type Retrieved Successfully",
        data: tourType
    })
})
const updateTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const tourType = await TourServices.updateTourType(req.params.id, req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Tour Type Updated Successfully",
        data: tourType
    })
})
const deleteTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const tourType = await TourServices.deleteTourType(req.params.id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Tour Type Deleted Successfully",
        data: tourType
    })
})
const createTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     
    const payload: ITour = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(file => file.path)
    }

    const tour = await TourServices.createTour(payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Tour Created Successfully",
        data: tour
    })
})
const getAllTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const query = req.query
    const tours = await TourServices.getAllTour(query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Tour Retrieved Successfully",
        data: tours.data,
        meta: tours.meta
    })
})
const getSingleTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const slug = req.params.slug
    const tour = await TourServices.getSingleTour(slug)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Tour Retrieved Successfully",
        data: tour
    })
})



const updateTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
      const payload: ITour = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(file => file.path)
    }
 
    const tour = await TourServices.updateTour(req.params.id, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Tour Updated Successfully",
        data: tour
    })
})

const deleteTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const tour = await TourServices.deleteTour(req.params.id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Tour Type Deleted Successfully",
        data: tour
    })
})




export const TourController = {
    createTourType,
    getAllTourType,
    getSingleTourType,
    updateTourType,
    deleteTourType,
    createTour,
    getAllTour,
    getSingleTour,
    updateTour,
    deleteTour,
}