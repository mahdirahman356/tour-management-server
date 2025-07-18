import { Router } from "express";
import { DivisionController } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionZodSchema, updateDivisionZodSchema } from "./division.validation";


const route = Router()
route.post("/create", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createDivisionZodSchema), DivisionController.createDivision)
route.get("/", DivisionController.getAllDivision)
route.get("/:slug", DivisionController.getSingleDivision)
route.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(updateDivisionZodSchema), DivisionController.updateDivision)
route.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.deleteDivision)
export const DivisionRoute = route