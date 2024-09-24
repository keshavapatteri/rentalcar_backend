import express from 'express'
import { AddCar, AdminCreate,adminLogin,AdminLogout,AdminProfile,Adminreviewlist,allcontact,bookingsstatus,checkAdmin, confirmPayment, createLocation, deleteBooking, deleteByReview, deleteCar, deleteUser, getAllBookings, getAllCars, getAllUsers, getPaymentDetails, getReviewsByCar, getTotalBooking, getTotalCars, getTotalReview, getTotalUsers, updateAdminCar,  updateReview,  updateUser} from '../../CONTROLLER/AdminController.js';

import { authAdmin } from '../../MIDDLEWARE/authAdmin.js';
import { upload } from '../../MIDDLEWARE/uploadMiddleware.js';

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

//user

//get all user
router.get("/user",authAdmin,getAllUsers); //

// Route to delete a user by ID (admin only)
router.delete("/delete/:id",authAdmin, deleteUser); //

// Route to update a user by ID (admin only)
router.put("/update/:id",authAdmin,updateUser);


//car


// Route to get all cars (admin only)
router.get("/car",authAdmin,getAllCars);  //

//adding car
router.post("/car/add",upload.single("image"),authAdmin,AddCar)


// Route to update a car by ID (admin only)
router.put("/updated/:id",authAdmin,updateAdminCar); //   updateCar, //

// Route to delete a car by ID (admin only)
router.delete("/car/:id",authAdmin,deleteCar) // 


//Bookings

// Route to get all bookings (admin only)
router.get("/allbookings",authAdmin,getAllBookings);  //


router.delete("/booking/:id",authAdmin, deleteBooking);  // 

//Review

// Route to get all reviews for a specific car
router.get("/car/:carId", getReviewsByCar);


router.get("/allreview",authAdmin,Adminreviewlist);  //

// Route to update a review by ID (user authenticated)
router.put("/reviewupdate/:id",authAdmin, updateReview);  // ithu vendaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

//review delete
router.delete("/deleted/:id",authAdmin,deleteByReview);  //


router.get("/totalUser",getTotalUsers)

router.get("/totalCar",getTotalCars)


router.get("/totalBooking",getTotalBooking)

router.get("/totalReview",getTotalReview)




router.get("/allcontact",authAdmin,allcontact)

/// Admin payment put

router.put("/paymentput/:id",confirmPayment)


router.get("/getpayments/:id",getPaymentDetails)
///
//change booking status
router.put("/bookingchange/:id",bookingsstatus) //


export default router;