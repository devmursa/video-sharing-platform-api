import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    videoFile: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    view: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },

    thumbnail:{
        type: String,
        required: true,
    }


  },
  { timestamps: true },
);

export const Video = mongoose.model("Video", videoSchema);

