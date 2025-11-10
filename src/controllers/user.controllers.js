//async handler is a helper file : basically a wrapper to eliminate errors

import {asyncHandler} from  "../utils/asyncHandler.js"
import {apierror} from "../utils/apierror.js";
import {User} from "../models/users.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {apiResponse} from "../utils/apiResponse.js";

//for login 
const generateAcessAndRefreshTokens= async(userId) =>
    {
        try {
            //taking from database
            const user=await User.findById(userId)
            const accessToken=user.generateAccessToken()
            const refreshToken=user.generateRefreshToken()

            //store refresh token in db: to not ask password again and again from user
            user.refreshToken=refreshToken
            await user.save({validateBeforeSave: false})

            return {accessToken,refreshToken};

        } catch (error) {
            throw new apierror(500,"Something went wrong while generating refresh and access token");
        }
    }  


const registerUser= asyncHandler(async(req,res) => {
    console.log("req.files:", req.files);
    console.log("req.body:", req.body);
    //get user detail from frontend

   const {fullName,email,username,password} =req.body

    // validation (to check not empty)

   //console.log("email",email);
   //entire do this alag alag for each feild
//    if(fullName===""){
//     throw new ApiError(400,"Fullname is required");
//    }

//OR YOU CAN DO THIS
if (
    [fullName,email,username,password].some((field)=> field?.trim()==="")
) {
    throw new apierror(400,"All fields are required");
}

    //check if user already exists: using email / username

   const existingUser= await User.findOne({
        //operators
        $or : [{username},{email}]
    })
    if(existingUser){
        throw new apierror(409,"User already exists");
    }

       //check for images,avatar

       const avatarLocalPath=req.files?.avatar[0]?.path;
    //   const coverImageLocalPath=req.files?.coverImage[0]?.path;

       let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
  coverImageLocalPath = req.files.coverImage[0].path;
}
       if (!avatarLocalPath) {
        throw new apierror(400,"avatar file is required");
       }

       //upload them to cloudinary
       const avatar=await uploadOnCloudinary(avatarLocalPath);
       const coverImage= await uploadOnCloudinary(coverImageLocalPath);

       if(!avatar) {
        throw new apierror(500,"avatar is not uploaded");
       }

         //create user object-create entry in db
         const user=await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage.url || "",
            email,
            password,
            username :username.toLowerCase()
         })

          //remove password and refresh token field from response

          //here the one inside string you don't want them
        const createdUser= await User.findById(user._id).select(
            "-password -refreshToken"
        )

            //check for user creation
        if(!createdUser){
            throw new apierror(500, "something went wrong while creating the user");
        }

        //send back response
        return res.status(201).json(
            new apiResponse(200,createdUser, "User registed succesfully")
        )

})

const loginUser=asyncHandler(async(req,res)=>{
    //req body->data

    const {email,username,password}=req.body
    if(!username || !email){
        throw new apierror(400,'username or email is required');
    }
    //finds a user either throw email or username
    const user=await User.findOne({
        $or: [{email},{username}]
    })

    if(!user){
        throw new apierror(404,"user doesn't exist");
    }
    //get user credidential
    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new apierror(401,"Invalid password");
    }
    
    //generate refresh token and access token
    const {accessToken,refreshToken}=await generateAcessAndRefreshTokens(user._id);

    //send cookies
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken");
    const options={
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
        new apiResponse(200, {
            user: loggedInUser,accessToken, refreshToken
        },
    "user loggedIn successfully")
    )
})

const logoutUser=asyncHandler(async(req,res)=>{
      await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            },
            
        },
        {
            new: true
        }
      )

      const options={
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new apiResponse(200,{}," user logged out successfully"))
})

export {registerUser,
    loginUser,
    logoutUser
}