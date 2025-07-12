import { Router } from "express";
import { AuthControllers } from "./auth.controller";


const route = Router()

route.post("/login", AuthControllers.credentialsLogin)

export const AuthRoute = route;