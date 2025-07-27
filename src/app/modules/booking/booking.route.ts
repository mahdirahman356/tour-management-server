import { Router } from "express"
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { createBookingZodSchema } from "./booking.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { BookingController } from "./booking.controller";


const router = Router()
router.post("/",
    checkAuth(...Object.values(Role)),
    validateRequest(createBookingZodSchema),
    BookingController.createBooking
);

router.get("/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    BookingController.getAllBookings
);

router.get("/my-bookings",
    checkAuth(...Object.values(Role)),
    BookingController.getUserBookings
);

router.get("/:bookingId",
    checkAuth(...Object.values(Role)),
    BookingController.getSingleBooking
);

export const BookingRoute = router