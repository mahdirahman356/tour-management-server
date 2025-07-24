import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";


const route = Router()

route.post("/login", AuthControllers.credentialsLogin)
route.post("/refresh-token", AuthControllers.getNewAccessToken)
route.post("/logout", AuthControllers.logout)
route.post("/change-password", checkAuth(...Object.values(Role)), AuthControllers.changePassword)
route.post("/set-password", checkAuth(...Object.values(Role)), AuthControllers.setPassword)
route.post("/forgot-password", AuthControllers.forgotPassword)
route.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword)


route.get("/google", async(req: Request, res: Response, next: NextFunction) => {
       const redirect = req.query.redirect || "/"
       passport.authenticate("google", {scope: ["profile", "email"], state: redirect as string})(req, res, next)
})
route.get("/google/callback", passport.authenticate("google", {failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!`}), AuthControllers.googleCallbackController)

export const AuthRoute = route;