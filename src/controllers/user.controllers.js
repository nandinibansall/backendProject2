//async handler is a helper file : basically a wrapper to eliminate errors

import {asyncHandler} from  "../utils/asyncHandler.js"

const registerUser= asyncHandler(async(req,res) => {
   return res.status(200).json({
        message: "ok"
    })
})


export {registerUser}