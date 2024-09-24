import {Review} from '../MODEL/reviewModel.js'
import { Car } from '../MODEL/carModel.js';

import { User } from '../MODEL/userModel.js';

// Create a new review

export const createReview = async (req, res, next) => {
    try {
      const { userId, carId, rating, reviewText } = req.body;
  
      // Validate input
      if (!userId || !carId || !rating || !reviewText) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
  
      // Check if user and car exist
      const userExists = await User.findById(userId);
      const carExists = await Car.findById(carId);
  
      if (!userExists) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      if (!carExists) {
        return res.status(404).json({ success: false, message: "Car not found" });
      }
// Check if the user has already reviewed this car
const existingReview = await Review.findOne({ user: userId, car: carId });

if (existingReview) {
  return res.status(400).json({ success: false, message: "You have already reviewed this car" });
}
  
      // Create the review
      const review = new Review({
        user: userId,
        car: carId,
        rating,
        reviewText,
      });
  
      await review.save();
  
      res.status(201).json({ success: true, message: "Review created successfully", data: review });
    } catch (error) {
      next(error);
    }
  };

// export const createReview = async (req, res, next) => {
//   try {
//     const { userId, carId, rating, reviewText } = req.body;

//     // Validate input
//     if (!userId || !carId || !rating || !reviewText) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }

//     // Check if user and car exist
//     const userExists = await User.findById(userId);
//     const carExists = await Car.findById(carId);

//     if (!userExists) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }
//     if (!carExists) {
//       return res.status(404).json({ success: false, message: "Car not found" });
//     }

//     // Check if the user has already reviewed this car
//     const existingReview = await Review.findOne({ user: userId, car: carId });

//     if (existingReview) {
//       return res.status(400).json({ success: false, message: "You have already reviewed this car" });
//     }

//     // Create the review
//     const review = new Review({
//       user: userId,
//       car: carId,
//       rating,
//       reviewText,
//     });

//     await review.save();

//     res.status(201).json({ success: true, message: "Review created successfully", data: review });
//   } catch (error) {
//     next(error);
//   }
// };






  
// Get all reviews for a specific car
export const getReviewsByCar = async (req, res, next) => {
    try {
      // const { carId } = req.params;
      const carId = req.params.id;
     
      
      // Check if car exists
      const carExists = await Car.findById(carId);
     
      if (!carExists) {
        return res.status(404).json({ success: false, message: "Car not found" });
      }
  
      const reviews = await Review.find({ car: carId }).populate("user", "username");
  
      res.status(200).json({ success: true, data: reviews });
    } catch (error) {
      next(error);
    }
  };


// Get a review by ID
export const getReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id).populate("user", "username").populate("car", "model");

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// Update a review by ID

export const updateReview = async (req, res, next) => {
  try {
    const { userId, carId, rating, reviewText } = req.body;
    const { id } = req.params;

    const updatedCarReview = await Review.findByIdAndUpdate(id, { user: userId, car: carId, rating, reviewText }, { new: true });

    if (!updatedCarReview) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    } 

    res.json({ success: true, message: 'Review updated successfully!', data: updatedCarReview });
  } catch (error) {
    console.error("Error updating review:", error.message);
    res.status(500).json({ success: false, message: "Failed to update review" });
    }
  };
  
//delete
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('Deleting review with ID:', id);


    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, message: "Review deleted successfully", data: review });
  } catch (error) {
    next(error);
  }
};

export const getreviewlist =async (req,res,next)=>{
  try {
      
      const reviewlist = await Review.find();
      
      res.json({success:true,message:"feetched review list",data:reviewlist});

  } catch (error) {
res.status(error.status||500).json({message:error.message||"Internal server error"})        
  }
}