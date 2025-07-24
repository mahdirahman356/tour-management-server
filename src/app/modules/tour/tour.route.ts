import { Router } from "express";
import { TourController } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourTypeZodSchema, createTourZodSchema, updateTourTypeZodSchema, updateTourZodSchema } from "./tour.validation";
import { multerUpload } from "../../config/multer.config";


const route = Router()

// --- Tour Type Routes ----
route.post("/create-tour-type",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourController.createTourType)

route.get("/tour-types",
    TourController.getAllTourType)

route.get("/tour-type/:id",
    TourController.getSingleTourType)

route.patch("/tour-types/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateTourTypeZodSchema),
    TourController.updateTourType)

route.delete("/tour-types/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    TourController.deleteTourType)

//---- Tour Routes ----
route.post("/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.array("files"),
    validateRequest(createTourZodSchema),
    TourController.createTour)

route.get("/",
    TourController.getAllTour)

route.get("/:slug",
    TourController.getSingleTour)

route.patch("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.array("files"),
    validateRequest(updateTourZodSchema),
    TourController.updateTour)

route.delete("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    TourController.deleteTour)
export const TourRoute = route