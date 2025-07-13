/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";


const route = Router()

route.post("/login", AuthControllers.credentialsLogin)
route.post("/refresh-token", AuthControllers.getNewAccessToken)
route.post("/logout", AuthControllers.logout)
route.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword)
route.get("/google", async(req: Request, res: Response, next: NextFunction) => {
       const redirect = req.query.redirect || "/"
       passport.authenticate("google", {scope: ["profile", "email"], state: redirect as string})(req, res)
})
route.get("/google/callback", passport.authenticate("google", {failureRedirect: "/login"}), AuthControllers.googleCallbackController)

export const AuthRoute = route;