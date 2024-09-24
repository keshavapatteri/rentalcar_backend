// import mongoose from "mongoose";
// const reviewSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   car: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Car",
//     required: true,
//   },
//   rating: {
//     type: Number,
//     required: true,
//     min: 1,  // Minimum rating value
//     max: 5,  // Maximum rating value
//   },
//   reviewText: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   reviewDate: {
//     type: Date,
//     default: Date.now,
//   },
// });

// reviewSchema.index({ user: 1, car: 1 }, { unique: true });
// export const Review = mongoose.model('Review',reviewSchema)


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

// Create a unique compound index to ensure a user can only review a specific car once
reviewSchema.index({ user: 1, car: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
