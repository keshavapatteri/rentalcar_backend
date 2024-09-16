import {Wishlist} from '../MODEL/wishlistModel.js'
import { Car } from '../MODEL/carModel.js';

import { User } from '../MODEL/userModel.js';

// Create or update a user's wishlist
export const userWishlist = async (req, res, next) => {
    try {
      const { userId, carId } = req.body;
  
      // Validate input
      if (!userId || !carId) {
        return res.status(400).json({ success: false, message: "User ID and Car ID are required" });
      }
  
      // Check if user exists
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Check if car exists
      const carExists = await Car.findById(carId);
      if (!carExists) {
        return res.status(404).json({ success: false, message: "Car not found" });
      }
  
      // Find or create wishlist
      let wishlist = await Wishlist.findOne({ user: userId });
  
      if (!wishlist) {
        wishlist = new Wishlist({ user: userId });
      }
  
      // Add or remove car from wishlist
      if (wishlist.cars.includes(carId)) {
        wishlist.cars.pull(carId); // Remove car if it already exists
      } else {
        wishlist.cars.push(carId); // Add car if it doesn't exist
      }
  
      await wishlist.save();
  
      res.status(200).json({ success: true, message: "Wishlist updated successfully", data: wishlist });
    } catch (error) {
      next(error);
    }
  };
  


export const getWishlist = async (req,res,next)=>{
   try {
    const{userId}=req.params;
    
    const wishlist = await Wishlist.findOne({user:userId}).populate('cars');
   
    if(!wishlist){
        return res.status(500).json({success:false,message:'whish list no found'})
    }
    res.status(200).json({success:true,data:wishlist})
   } catch (error) {
  
    next();
   }
};


//delete wish list
export const deleteWishlist = async (req, res, next) => {
    try {
      const { userId } = req.params;
  
      // Find the wishlist for the user
      const wishlist = await Wishlist.findOne({ user: userId });
  
      if (!wishlist) {
        return res.status(404).json({ success: false, message: 'Wishlist not found' });
      }
  
      // Delete the wishlist
      await Wishlist.deleteOne({ user: userId });
  
      res.json({ success: true, message: 'Wishlist deleted successfully' });
    } catch (error) {
      next(error);
    }
  };


