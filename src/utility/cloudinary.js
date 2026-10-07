import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_APP_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async function (path) {
  try {
    const uploadRes = await cloudinary.uploader.upload(path, {
      resource_type: "auto",
    });

  await  fs.unlink(path);

    return uploadRes;
  } catch (error) {
   await fs.unlink(path);
    throw error;
  }
};

export const deleteOnCloudinary = async function (public_id) {
  try {
    const deleteRes = await cloudinary.uploader.destroy(public_id, {
      invalidate: true,
    });
    return deleteRes;

  } catch (error) {
    throw error;
  }
};
