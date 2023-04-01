import mongoose, { model, Schema } from "mongoose";

const logoutSchema = new Schema(
    {
       token:{
        type: String,
        required: true
       },
       exp:{
        type: Number,
        required: true
       }
    }
)

const LogoutModel = mongoose.model.Logout || model('Logout',logoutSchema)
export default LogoutModel