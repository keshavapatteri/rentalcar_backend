import express from 'express'
import { authUser } from '../../MIDDLEWARE/authUser.js';
import { deleteWishlist, getWishlist, userWishlist } from '../../CONTROLLER/wishListController.js';
const router = express.Router()

// Route to add or remove a car from the wishlist (user authenticated)
router.post("/add-remove",authUser, userWishlist);

// Route to get a user's wishlist
router.get("/user/:userId",authUser, getWishlist);


//userdelete    
router.delete("/delete/:userId",authUser, deleteWishlist);


export default router;