/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { DivisionServices } from "./division.service";
import { IDivision } from "./division.interfase";


const createDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     
    const payload: IDivision = {
        ...req.body,
        thumbnail: req.file?.path
    }

    const division = await DivisionServices.createDivision(payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Division Created Successfully",
        data: division
    })
})

const updateDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

       const payload: IDivision = {
        ...req.body,
        thumbnail: req.file?.path
    }

      const UpdatedDivision = await DivisionServices.updateDivision(req.params.id, payload)
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Division Updated Successfully",
        data: UpdatedDivision
    })
})

const getAllDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const division = await DivisionServices.getAllDivision(query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Divisions Retrieved Successfully",
        data: division.data,
        meta: division.meta
    })
})
const getSingleDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const division = await DivisionServices.getSingleDivision(req.params.slug)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Division Retrieved Successfully",
        data: division
    })
})


const deleteDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     
     const deletedDivision = await DivisionServices.deleteDivision(req.params.id) 
      
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Division Deleted Successfully",
        data: deletedDivision
    })
}) 

export const DivisionController = {
    createDivision,
    getAllDivision,
    updateDivision,
    deleteDivision,
    getSingleDivision
}