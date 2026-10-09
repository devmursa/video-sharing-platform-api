import { User } from "../model/user.model.js";
import APIError from "../utility/APIError.js";
import asyncHandler from "../utility/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteOnCloudinary,
} from "../utility/cloudinary.js";

const generateToken = async function (data) {
  const accessToken = await data.generateAccessToken();
  if (!accessToken) {
    throw new APIError(400, "failed accessToken!");
  }
  const refreshToken = await data.generateRefreshToken();
  if (!refreshToken) {
    throw new APIError(400, "failed refreshToken!");
  }

  return { accessToken, refreshToken };
};

const userRegister = asyncHandler(async function (req, res) {
  const { username, email, password, fullname } = req.body;

  if (
    [username, email, password, fullname].some((data) => data.trim() === "")
  ) {
    throw new APIError(400, "Fields can't be empty!");
  }

  const avatarPath = req.files?.avatar?.[0].path;
  if (!avatarPath) {
    throw new APIError(400, "Invalid avatar path!");
  }

  const avatarOnCloudinary = await uploadOnCloudinary(avatarPath);

  if (!avatarOnCloudinary) {
    throw new APIError(400, "avatar upload failed!");
  }

  let coverImgPath = req.files?.coverImg?.[0].path || "";
  let CoverImgOnCloudinary;
  if (coverImgPath) {
    CoverImgOnCloudinary = await uploadOnCloudinary(coverImgPath);
  }

  const createUser = await User.create({
    username,
    email,
    password,
    fullname,
    avatar: {
      url: avatarOnCloudinary.url,
      public_id: avatarOnCloudinary.public_id,
    },
    coverImg: {
      url: CoverImgOnCloudinary.url || "",
      public_id: CoverImgOnCloudinary.public_id || "",
    },
  });

  if (!createUser) {
    throw new APIError(404, "User register failed!");
  }

  const { accessToken, refreshToken } = await generateToken(createUser);

  createUser.refreshToken = refreshToken;

  await createUser.save({ validateBeforeSave: false });

  const getUser = await User.findById(createUser._id).select(
    "-password -refreshToken",
  );

  if (!getUser) {
    throw new APIError(404, "Invalid User!");
  }

  const option = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json({ mes: "register" });
});

const userLogin = asyncHandler(async function (req, res) {
  const { email, password } = req.body;

  if ([email, password].some((data) => data.trim() === "")) {
    throw new APIError(400, "Fields can't be empty!");
  }

  const findUser = await User.findOne({ email });

  if (!findUser) {
    throw new APIError(400, "Invalid credentials!");
  }

  const isPasswordCorrect = await findUser.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new APIError(400, "Invalid credentials!");
  }

  const { accessToken, refreshToken } = await generateToken(findUser);

  findUser.refreshToken = refreshToken;

  await findUser.save({ validateBeforeSave: false });

  const getUser = await User.findById(findUser._id).select(
    "-password -refreshToken",
  );

  if (!getUser) {
    throw new APIError(404, "Invalid credentials!");
  }

  req.user = getUser;

  console.log(req);

  const option = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json({ mes: "login" });
});

const userLogout = asyncHandler(async function (req, res) {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  req.user = "";

  const option = { httpOnly: true, secure: true };

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json({ mes: "logout" });
});

const changePassword = asyncHandler(async function (req, res) {
  const { password, newPassword } = req.body;

  if (!(password || newPassword)) {
    throw new APIError(400, "field can't be empty!");
  }
  const getUser = await User.findById(req.user._id);
  console.log(getUser);
  const isPasswordCorrect = await getUser.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new APIError(400, "Invalid password!");
  }

  getUser.password = newPassword;
  await getUser.save();

  console.log(getUser);

  return res.status(200).json({ mes: "changePassword" });
});

const changeAvatar = asyncHandler(async function (req, res) {
  console.log(req.user.avatar);
  const oldAvatarId = req.user.avatar.public_id;
  const newAvatarPath = req?.file?.path;
  if (!newAvatarPath) {
    throw new APIError(400, "Invalid Avatar!");
  }

  const newAvatar = await uploadOnCloudinary(newAvatarPath);

  if (!newAvatar) {
    throw new APIError(400, "Avatar upload failed!");
  }

  const updateAvatar = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: {
          url: newAvatar.url,
          public_id: newAvatar.public_id,
        },
      },
    },
    { returnDocument: "after" },
  );

  if (!updateAvatar) {
    throw new APIError(400, "avatar  failed!");
  }

  const deleteAvatar = await deleteOnCloudinary(oldAvatarId);
  if (!deleteAvatar) {
    throw new APIError(400, "avatar delete failed!");
  }

  req.user = updateAvatar;
  console.log(req.user);

  return res.status(200).json({ mes: "changeAvatar" });
});

const getWatchHistory = asyncHandler(async function (req, res) {
  const getUserHistory = await User.aggregate([
    { $match: { _id: req.user._id } },

    {
      $lookup: {
        from: "videos",
        foreignField: "_id",
        localField: "watchHistory",
        as: "watchHistory",
      },
    },
  ]);
});

const getUserProfile = asyncHandler(async function (req, res) {

const username=req.params?.user;
if(!username){throw new APIError(400,"Username is missing")}

const getUserProfile=await User.aggregate([
 { $match:{username}},

 { $lookup:{
  from:"subscriptions",
  localField:"_id",
  foreignField:"channel",
  as:"subscribers"
 }},

 { $lookup:{
  from:"subscriptions",
  localField:"_id",
  foreignField:"subscriber",
  as:"subscribedTo"
 }}


])
console.log(getUserProfile)


 return res.status(200).json({ mes: "getUserProfile" });
})




export {
  userRegister,
  userLogin,
  userLogout,
  changePassword,
  changeAvatar,
  getWatchHistory,
  getUserProfile
};
