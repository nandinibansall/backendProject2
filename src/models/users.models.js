import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const user=new mongoose.Schema({
    username : {
        type: String,
        required: true,
        lowercase : true,
        unique : true,
        trim: true,
        index: true //comes in db searching (easy when needed to search)
    },
    email : {
        type: String,
        required: true,
        lowercase : true,
        unique : true,
        trim: true,
    },
    fullName : {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar : {
        type: String, //cloundinary url (something like aws)
        required: true,
    },
    coverImage : {
        type: String,
    },
    watchHistory : [
        {
            type: Schema.Types.ObjectId,
            ref: "Videos"
        }
    ],
    password : {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken:{
        type: String 
    }
},{timestamp: true})
//hooks
user.pre("save",async function (next) {
    //this is to make sure chalenga only if password is changed
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10)
    next()
})
//custom method
user.methods.isPasswrodCorrect= async function(password){
    return await bcrypt.compare(password,this.password)
}

//access-token method
user.methods.generateAcessToken=function(){
    jwt.sign({
        _id: this._id,
        email : this.email,
        username : this.username,
        fullname : this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
//refresh token method
user.methods.generateRefreshToken=function(){
    jwt.sign({
        _id: this._id,
        email : this.email,
        username : this.username,
        fullname : this.fullname
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    })

}
export const User=mongoose.model("User",user)