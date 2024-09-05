import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,  // Minimum rating value
    max: 5,  // Maximum rating value
  },
  reviewText: {
    type: String,
    required: true,
    trim: true,
  },
  reviewDate: {
    type: Date,
    default: Date.now,
  },
});


export const Review = mongoose.model('Review',reviewSchema)