//require('dotenv').config({path: './env'})  GOOD PRACTICE

import dotenv from "dotenv"
//ifes(immediately chala do function)
import connectDB from "./db/index.js"


dotenv.config({
    path: './env'
})
connectDB()




/* APPROACH 1 EVERYTHING IN INDEX.JS

import mongoose from "mongoose";
import {DB_NAME} from "./constansts"
import express from "express"
const app=express()
(async()=> {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(wrror)=>{
            console.log("app not able to lsiten")
            throw error
        }) //listener (if app cannot listen to db)

        app.listen(process.env.PORT,()=>{
            console.log(`process listening ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("Error: ",error)
        throw error
    }
})() */