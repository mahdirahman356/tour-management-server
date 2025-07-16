import AppError from "../../errorHelpers/AppError";
import { Division } from "../division/division.model";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatus from "http-status-codes"


const createTourType = async (payload: Partial<ITourType>) => {
     const tourType = await TourType.create(payload)
     return tourType
}
const getAllTourType = async () => {
     const tourType = await TourType.find()
     const totalTourType = await TourType.countDocuments()

     return {
          data: tourType,
          meta: {
               total: totalTourType
          }
     }
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
     
     if(isLinked){
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

const getAllTour = async () => {

     const tour = await Tour.find()
     const totalTour = await Tour.countDocuments()

     return {
          data: tour,
          meta: {
               total: totalTour
          }
     }
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
     updateTourType,
     deleteTourType,
     createTour,
     getAllTour,
     updateTour,
     deleteTour
}