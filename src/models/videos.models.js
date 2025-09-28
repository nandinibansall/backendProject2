import mongoose, { trusted } from"mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videos=new mongoose.Schema({
    videoFile:{
        type: String,  //cloudnary
        required: true
    },
    thumbnail:{
        type: String, //cloudnary
        required: true
    },
    title :{
        type: String,
        required: true
    },
    description :{
        type: String,
        required: true
    },
    duration:{
        type: Number, //cloudnary 
        required: true
    },
    views:{
        type: Number,
        default: 0
    },
    isPublished:{
        type: Boolean,
        default :  true
    },
    owner:{
        type: Schema.Type.ObjectId,
        ref : "User"
    }
},{timestamp: true})


videos.plugin(mongooseAggregatePaginate)


export const Videos=mongoose.model("Videos",videos);