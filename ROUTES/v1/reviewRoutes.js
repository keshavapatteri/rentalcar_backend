import express from 'express'
import { createReview, deleteReview, getReviewById, getreviewlist, getReviewsByCar, updateReview } from '../../CONTROLLER/reviewController.js';
import { authUser } from '../../MIDDLEWARE/authUser.js';

const router = express.Router()

// Route to create a new review (user authenticated)
router.post("/create",authUser,createReview);  //

// Route to get all reviews for a specific car
router.get("/car/:id", getReviewsByCar);

// Route to get a review by ID
router.get("/booking/:id", getReviewById);

// Route to update a review by ID (user authenticated)
router.put("/update/:id",authUser, updateReview);


router.get('/reviewlist',getreviewlist);



// Route to delete a review by ID (user authenticated)
router.delete("/delete/:id",authUser, deleteReview);
export default router;