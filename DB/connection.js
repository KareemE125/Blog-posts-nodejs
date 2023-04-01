import mongoose from "mongoose";

export default async function connectDB(){
    return await mongoose.connect(process.env.MONGO_DB_URL)
    .then(_=>console.log("Database Connected :)"))
    .catch(error=>console.log("Failed to Connect Database :(\nERROR => ",error))
}