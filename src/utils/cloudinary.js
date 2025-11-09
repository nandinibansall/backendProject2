// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs"
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });


// const uploadOnCloudinary=async ( localFilepath) => {
//     try {
//         if(!localFilepath){
//             return null;
//         }
//         //upload the file on cloudinary
//         const response= cloudinary.uploader.upload(localFilepath, {
//             resource_type: "auto"
//         })
//         //file has been uploaded successfully
//      //   console.log("file uploaded successfully", response.url);
//      fs.unlinkSync(localFilepath) 
//         return response;    
//     } catch (error) {   
//         fs.unlinkSync(localFilepath) //removes the locally saved temporary file as the upload operation got failed
//         return null;
//     }
// }

// export {uploadOnCloudinary};
// cloudinary.v2.uploader.upload("path",{public_id: "olympic_flag"}, function(error,result) {console.log(result); });

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // ✅ convert relative path to absolute
    const absolutePath = path.resolve(localFilePath);

    // ✅ await is very important here
    const response = await cloudinary.uploader.upload(absolutePath, {
      resource_type: "auto",
    });

    // ✅ safely remove local file only after upload success
    fs.unlinkSync(absolutePath);

    // optional: console.log("File uploaded successfully:", response.url);
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // ✅ cleanup: remove file only if it exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };