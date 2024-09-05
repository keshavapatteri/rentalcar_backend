import express from 'express'
import { AddCar, AdminCreate,adminLogin,AdminLogout,AdminProfile,checkAdmin, createLocation, deleteBooking, deleteByReview, deleteCar, deleteUser, getAllBookings, getAllCars, getAllUsers, getReviewsByCar, updateCar,  updateReview,  updateUser} from '../../CONTROLLER/AdminController.js';

import { authAdmin } from '../../MIDDLEWARE/authAdmin.js';

const router = express.Router()
//create admin
router.post('/create',AdminCreate);
//for profile seeing
router.get('/profile/:id',authAdmin,AdminProfile);

//cheack user for frontent protection
router.get('/cheack-user',authAdmin,checkAdmin)
// login
router.post("/login",adminLogin);
//logout
router.post("/logout",AdminLogout);


//get all user
router.get("/user",authAdmin,getAllUsers);

// Route to delete a user by ID (admin only)
router.delete("/delete/:id",authAdmin, deleteUser);

// Route to update a user by ID (admin only)
router.put("/update/:id",authAdmin,updateUser);



// Route to get all cars (admin only)
router.get("/car", authAdmin, getAllCars);

//adding car
router.post("/car/add",authAdmin,AddCar)


// Route to update a car by ID (admin only)
router.put("/update",authAdmin,updateCar);

// Route to delete a car by ID (admin only)
router.delete("/car/:id",authAdmin,deleteCar)




// Route to get all bookings (admin only)
router.get("/allbookings",authAdmin, getAllBookings);


router.delete("/booking/:id", authAdmin, deleteBooking);

//
// Route to get all reviews for a specific car
router.get("/car/:carId", getReviewsByCar);


// Route to update a review by ID (user authenticated)
router.put("/updated/:id",authAdmin, updateReview);

//review delete
router.delete("/deleted/:reviewId",authAdmin,deleteByReview);

export default router;