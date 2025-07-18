import { tourSearchableFilds, tourTypeSearchableFilds } from "../../constants";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Division } from "../division/division.model";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatus from "http-status-codes"


const createTourType = async (payload: Partial<ITourType>) => {
     const tourType = await TourType.create(payload)
     return tourType
}
const getAllTourType = async (query: Record<string, string>) => {
     const queryBuilder = new QueryBuilder(TourType.find(), query)

     const tourType = await queryBuilder
          .search(tourTypeSearchableFilds)
          .filter()
          .sort()
          .fields()
          .build()
     const meta = await TourType.countDocuments()

     return {
          data: tourType,
          meta: {
               total: meta
          }
     }
}
const getSingleTourType = async (tourTypeId: string) => {
     const tourType = await TourType.findOne({ _id: tourTypeId })
     if (!tourType) {
          throw new AppError(httpStatus.NOT_FOUND, "Tour Type Not Found")
     }
     return tourType
}
const updateTourType = async (tourTypeId: string, payload: Partial<ITourType>) => {
     const updatedTourType = await TourType.findByIdAndUpdate(tourTypeId, payload, { new: true, runValidators: true })
     if (!updatedTourType) {
          throw new AppError(httpStatus.NOT_FOUND, "Tour Type Not Found")
     }
     return updatedTourType
}
const deleteTourType = async (tourTypeId: string) => {

     const isLinked = await Tour.exists({ tourType: tourTypeId })

     if (isLinked) {
          throw new AppError(httpStatus.BAD_REQUEST, "Cannot delete. Tours are linked to this tour type.")
     }

     const tourType = await TourType.findByIdAndDelete(tourTypeId)

     if (!tourType) {
          throw new AppError(httpStatus.NOT_FOUND, "Tour Type Not Found")
     }
     return tourType
}

const createTour = async (payload: Partial<ITour>) => {

     const { division, tourType } = payload

     const isDevisionExist = await Division.findById(division)
     const isTourTypeExist = await TourType.findById(tourType)
     if (!isDevisionExist) {
          throw new AppError(httpStatus.NOT_FOUND, "Devision Not Found")
     }
     if (!isTourTypeExist) {
          throw new AppError(httpStatus.NOT_FOUND, "Tour Type Not Found")
     }

     const tour = await Tour.create(payload)
     return tour

}

const getAllTour = async (query: Record<string, string>) => {

     const queryBuilder = new QueryBuilder(Tour.find(), query)
     const tours = await queryBuilder
          .search(tourSearchableFilds)
          .filter()
          .sort()
          .fields()
          .paginate()
          .build()

     const meta = await queryBuilder.getMeta()

     return {
          data: tours,
          meta: meta
     }
}
const getSingleTour = async (slug: string) => {

     const tour = await Tour.findOne({ slug })
     if (!tour) {
          throw new AppError(httpStatus.NOT_FOUND, "Tour Not Found")
     }
     return tour
}

const updateTour = async (tourId: string, payload: Partial<ITour>) => {

     const { division, tourType } = payload

     if (division) {
          const isDivisionExist = await Division.findById(division);
          if (!isDivisionExist) {
               throw new AppError(httpStatus.NOT_FOUND, "Division Not Found");
          }
     }

     if (tourType) {
          const isTourTypeExist = await TourType.findById(tourType);
          if (!isTourTypeExist) {
               throw new AppError(httpStatus.NOT_FOUND, "Tour Type Not Found");
          }
     }

     const updatedTour = await Tour.findByIdAndUpdate(tourId, payload, { new: true, runValidators: true })

     if (!updatedTour) {
          throw new AppError(httpStatus.NOT_FOUND, "No Tour Found")
     }
     return updatedTour
}

const deleteTour = async (tourId: string) => {
     const tour = await Tour.findByIdAndDelete(tourId)

     if (!tour) {
          throw new AppError(httpStatus.NOT_FOUND, "No Tour Found")
     }
     return tour
}


export const TourServices = {
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
}