import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

app.on("error",(error)=>{
    console.log("ERRR", error);
    throw error;
})

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("assets"))
app.use(cookieParser())


//routes import
import userRouter from "./routes/user.routes.js"
//routes declaration
app.use("/api/v1/users",userRouter) //used use coz you have to call a middleware

//now the url will be
// https://localhost:8000/api/v1/users/register
export default app