import mongoose, { Schema, trusted } from "mongoose"

const tweetSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }, {timestamp:true}
)

export const tweet=mongoose.model("tweet",tweetSchema)