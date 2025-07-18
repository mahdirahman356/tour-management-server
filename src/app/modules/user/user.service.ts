import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs"
import { JwtPayload } from "jsonwebtoken"
import httpStatus from "http-status-codes"
import { envVars } from "../../config/env";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFilds } from "../../constants";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload
    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    const hashedPassword = await bcryptjs.hash(password as string, 10)

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })

    return user
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const ifUserExist = await User.findById(userId)

    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    if (ifUserExist.isDeleted || ifUserExist.isActive === IsActive.BLOCKED) {
        throw new AppError(httpStatus.FORBIDDEN, "This user can not be updated")
    }

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}

const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find(), query)

    const user = await queryBuilder
        .search(userSearchableFilds)
        .filter()
        .sort()
        .fields()
        .paginate()
        .build()
    const meta = await queryBuilder.getMeta()

    return {
        data: user,
        meta: meta
    }
}
const getSingleUser = async (id: string) => {
    
    const user = await User.findOne({_id: id})
    if(!user){
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }
    return user
}

export const UserServices = {
    createUser,
    getAllUsers,
    updateUser,
    getSingleUser
}