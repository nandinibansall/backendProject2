import mongoose from "mongoose"
import {DB_NAME} from "../constants.js"

const connectDB= async () =>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance}`) //to make sure which host we are connected to.
        console.log(connectionInstance)
    } catch (error) {
        console.log("mongodb can't connect",error);
        process.exit(1)
    }
}


export default connectDB