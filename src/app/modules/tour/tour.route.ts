import { Router } from "express";
import { TourController } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourTypeZodSchema, createTourZodSchema, updateTourTypeZodSchema, updateTourZodSchema } from "./tour.validation";


const route = Router()
route.post("/create-tour-type", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createTourTypeZodSchema), TourController.createTourType)
route.get("/tour-types", checkAuth(...Object.values(Role)), TourController.getAllTourType)
route.patch("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(updateTourTypeZodSchema), TourController.updateTourType)
route.delete("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTourType)
route.post("/create",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createTourZodSchema), TourController.createTour)
route.get("/",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.getAllTour)
route.patch("/:id",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(updateTourZodSchema), TourController.updateTour)
route.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTour)
export const TourRoute = route