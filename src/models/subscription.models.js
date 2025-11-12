import mongoose,{Schema} from "mpngoose"

const subscriptionSchema=new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, //one who is subscribing
        ref: "User"
    },
    channel:{
        type: Schema.Types.ObjectId, //one to who subscriber subscribe
        ref: "User"
    }

},{timestamps: true})


export const Subscription=mongoose.model("Subscription",subscriptionSchema)
