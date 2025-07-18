import { divisionSearchableFilds } from "../../constants";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Tour } from "../tour/tour.model";
import { IDivision } from "./division.interfase";
import { Division } from "./division.model";
import httpStatus from "http-status-codes"


const createDivision = async (payload: Partial<IDivision>) => {

    const existingDivision = await Division.findOne({ name: payload.name })
    if (existingDivision) {
        throw new AppError(httpStatus.BAD_REQUEST, "A division with this name already exist")
    }


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

const getAllDivision = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Division.find(), query)

    const division = await queryBuilder
        .search(divisionSearchableFilds)
        .filter()
        .sort()
        .fields()
        .paginate()
        .build()
    const meta = await queryBuilder.getMeta()

    return {
        data: division,
        meta: meta
    }
}
const getSingleDivision = async (slug: string) => {

    const division = await Division.findOne({ slug })

    if (!division) {
        throw new AppError(httpStatus.NOT_FOUND, "Division Not Found")
    }

    return division
}



const deleteDivision = async (divisionId: string) => {

    const isLinked = await Tour.exists({ division: divisionId })

    if (isLinked) {
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
    deleteDivision,
    getSingleDivision
}