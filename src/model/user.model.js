import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required!"],
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "email is required!"],
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "password is required!"],
    },

    fullname: {
      type: String,
    },

    avatar: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },

    coverImg: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
      },
    },

    watchHistory: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    }],

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

schema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

schema.methods.isPasswordCorrect = async function (password) {
  const isPasswordCorrect = await bcrypt.compare(password, this.password);
  return isPasswordCorrect;
};

schema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "1h" },
  );
};

schema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "30d" },
  );
};

export const User = mongoose.model("user", schema);
