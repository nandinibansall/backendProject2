import mongoose, { Schema, trusted } from "mongoose"

const likeSchema = new mongoose.Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Videos"
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "comment"
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        },
        tweetLike: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }, {timestamp:true}
)

export const like=mongoose.model("like",likeSchema)