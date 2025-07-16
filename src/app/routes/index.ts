import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { DivisionRoute } from "../modules/division/division.route";
import { TourRoute } from "../modules/tour/tour.route";


export const router = Router()

const moduleRoutes = [
    {
      path: "/user",
      route: UserRoute
    },
    {
      path: "/auth",
      route: AuthRoute
    },
    {
      path: "/division",
      route: DivisionRoute
    },
    {
      path: "/tour",
      route: TourRoute
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})