import mongoose, { Schema, trusted } from "mongoose"

const playlistSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        video: [{
            type: Schema.Types.ObjectId,
            ref: "Videos"
        }],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }, {timestamp:true}
)

export const playlist=mongoose.model("playlist",playlistSchema)