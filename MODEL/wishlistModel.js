import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cars: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  

export const Wishlist  = mongoose.model('Wishlist', wishlistSchema)


