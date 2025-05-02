import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser =asyncHandler(async (req,res)=>{
/// get user details  from fontend
// validation - not empty
// check is user already Exists: username ,email
// check for images,check for avtar
//upload them to cloudinary
// create user object- create entry in db
// remove password and refresh token field and reponse
//return res

const {fullname,email,username,password}  = req.body
// if (fullname === ""){
// throw new ApiError(
//   400,"Full Name is required"
// )
// }

if (
  [fullname,email,username,password].some((field)=>field.trim()=== "")
) {
  throw new ApiError(400,"All fields are required")
}

const existedUser = User.findOne({
  $or: [{username} , {email}]
})

if(existedUser){
  throw new ApiError(409,"User with email or username already exist")
}

const avatarLocalPath =  req.files?.avatar[0]?.path;

const coverImageLocalPath= req.files?.coverImage[0]?.path;

if (!avatarLocalPath) {
  throw new ApiError(400,"Avtar file is required")
}

 const avtar = await uploadOnCloudinary(avatarLocalPath)
 const coverImage = await uploadOnCloudinary(coverImageLocalPath)
if(!avtar){
  throw new ApiError(400,"Avtar file is required")
}

const user =  await User.create({
  fullname,
  avtar:avtar.url,
  coverImage:coverImage?.url || "",
  email,
  password,
  username:username.toLowerCase()
 })

 const createdUserName = await User.findById(user._id).select(
  "-password -refreshToken"
 )
if(!createdUserName){
  throw new ApiError(500,"somthing went wrong when registering the  user")
}

return res.status(201).json(
new ApiResponse(200,createdUserName,"Craeted user successfully ")

)




})



export {registerUser}