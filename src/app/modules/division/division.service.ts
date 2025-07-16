import AppError from "../../errorHelpers/AppError";
import { Tour } from "../tour/tour.model";
import { IDivision } from "./division.interfase";
import { Division } from "./division.model";
import httpStatus from "http-status-codes"


const createDivision = async (payload: Partial<IDivision>) => {
    const division = await Division.create(payload)
    return division
}

const updateDivision = async (divisionId: string, payload: Partial<IDivision>) => {
    const updatedDivision = await Division.findByIdAndUpdate(divisionId, payload, { new: true, runValidators: true })
    if (!updatedDivision) {
        throw new AppError(httpStatus.NOT_FOUND, "Division Not Found");
    }
    return updatedDivision
}

const getAllDivision = async () => {
    const division = await Division.find()
    const totalDivition = await Division.countDocuments()

    return {
        data: division,
        meta: {
            total: totalDivition
        }
    }
}

const deleteDivision = async (divisionId: string) => {

    const isLinked = await Tour.exists({ division: divisionId })
    
    if(isLinked){
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot delete. Tours are linked to this division.")
    }
 
    const deletedDivision = await Division.findByIdAndDelete(divisionId)
    if (!deletedDivision) {
        throw new AppError(httpStatus.NOT_FOUND, "Division Not Found")
    }

    return deletedDivision
}

export const DivisionServices = {
    createDivision,
    updateDivision,
    getAllDivision,
    deleteDivision
}