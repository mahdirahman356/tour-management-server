import { Router } from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";



const router = Router()

router.post("/register", validateRequest(createUserZodSchema), UserController.createUser)
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserController.getAllUser)
router.get("/me", checkAuth(...Object.values(Role)), UserController.getMe)
router.get("/:id", checkAuth(...Object.values(Role)), UserController.getSingleUser)
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserController.updateUser)
export const UserRoute = router