import { model, Schema } from "mongoose";
import { IDivision } from "./division.interfase";

const divisionSchema = new Schema<IDivision>({
       name: {type: String, required: true, unique: true},
       slug: {type: String, unique: true},
       thumbmnail: {type: String},
       description: {type: String}
},{
    timestamps: true
})

export const Division = model<IDivision>("Division", divisionSchema)