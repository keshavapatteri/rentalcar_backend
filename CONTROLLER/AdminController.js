
import bcrypt from "bcrypt"
import { generateAdminToken } from '../UTILITIS/generateAdminToken.js';
import { Admin } from '../MODEL/adminModel.js';
import { User } from "../MODEL/userModel.js";
import { Car } from "../MODEL/carModel.js"
import { Booking } from "../MODEL/bookingModel.js";
import { Review } from "../MODEL/reviewModel.js";
import { cloudinaryInstance } from "../Config/cloudinaryConfig.js";
import { Contact } from "../MODEL/contactModel.js";

//admin create
export const AdminCreate = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;


    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const adminExist = await Admin.findOne({ email });

    if (adminExist) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create new admin
    const newAdmin = new Admin({ username, email, password: hashedPassword });
    await newAdmin.save();

    // Generate token
    const token = generateAdminToken(email, "admin");

    // Set token in cookie
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.json({ success: true, message: "Admin created successfully" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Internal server error" });
  }
};




// admin profile
export const AdminProfile = async (req, res, next) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    console.log(id)

    const usedata = await Admin.findById(id);
    res.json({ success: true, message: "user data fetched", data: usedata })
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server" });


  }
};
//=====>
// Check user authentication
export const checkAdmin = async (req, res, next) => {
  try {
    const admin = req.user;

    // If user is not authenticated, return an error
    if (!admin) {
      return res.status(400).json({ success: false, message: 'admin not authenticated' });
    }

    // If user is authenticated, send success response
    return res.json({ success: true, message: "admin authenticated" });
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Login admin

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const adminExist = await Admin.findOne({ email });

    if (!adminExist) {
      return res.status(404).json({ success: false, message: "Admin does not exist" });
    }

    // Compare provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, adminExist.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Create token (assuming you have a function `generateAdminToken`)
    const token = generateAdminToken(adminExist._id, "admin");

    res.cookie("token", token, {
      sameSite: "None",
      secure: true,
      httpOnly: true,
        });

  res.cookie('token', token,{sameSite:"None",secure:true});
  
    // Send response
    return res.json({ success: true, message: "Admin login successful", status: 200, token });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};
//logout
export const AdminLogout = async (req, res, next) => {

  res.clearCookie("token")
  res.json({ success: true, message: 'Admin logged out successfully' })


}


//get all data from user
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Delete a user by ID
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

//update user
export const updateUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    const { id } = req.params;
    const updateUser = await User.findByIdAndUpdate(id, { username, email, password }, { new: true })


    res.json({ success: true, message: "New car list Updated successfully", data: updateUser });

  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Internal server error" })
  }
}

//get total users count
export const getTotalUsers = async (req, res) => {
  try {
    const totalUser = await User.countDocuments(); // Counts total cars in the collection
    res.status(200).json({ total: totalUser });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total cars" });
  }
};







//car
//get all cars
export const getAllCars = async (req, res, next) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    next(error);
  }
};



export const AddCar = async (req, res, next) => {
  try {
    const {
      title,category, model, year, priceperday, capacity, fuel,
      transmission, mileage, status, color, registrationnumber,
      location, insurancedetails
    } = req.body;

    // Check if an image file is provided
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload an image" });
    }

    // Check if the car model already exists in the database
    const existingCar = await Car.findOne({ model });
    if (existingCar) {
      return res.status(400).json({ success: false, message: "Car already exists" });
    }

    // Upload the image to Cloudinary
    const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path, { folder: "car" });

    // Create a new car object with the provided data
    const newCar = new Car({
      title,category, model, year, priceperday, capacity, fuel,
      transmission, mileage, status, color, registrationnumber,
      location, insurancedetails,
      image: uploadResult?.url // Save the image URL from Cloudinary
    });

    // Save the new car to the database
    await newCar.save();

    // Respond with success message and the created car data
    res.json({ success: true, message: 'New car created successfully!', data: newCar });

  } catch (error) {
    console.error(error.message);
    // Pass the error to the next middleware
    next(error);
  }
};
  


export const updateAdminCar = async (req, res, next) => {
  try {
    // Copying all request body data into updateData
    let updateData = { ...req.body }; 
    console.log("Update data:", updateData);


    // Accessing the car ID from req.params directly
    const id = req.params.id;  // No need to destructure it from req.params
    console.log("Car ID from params:", id);

    // Finding and updating the car by ID, returning the updated car
    const updateCar = await Car.findByIdAndUpdate(id, updateData, { new: true });

    console.log("Updated car:", updateCar);

    // Sending the updated car data in response
    res.json({ success: true, message: "Car updated successfully", data: updateCar });
  } catch (error) {
    // Handling any errors
    console.error("Error updating car:", error);
    res.status(error.status || 500).json({ message: error.message || "Internal server error" });
  }
};





//delete car
export const deleteCar = async (req, res, next) => {
  try {
    const { model, Year, priceperday, capacity, fuel, transmission, milege, status, color, registrationnumber, location, insurancedetails } = req.body
    // const {id}=req.query;
    const { id } = req.params;
    const deleteCar = await Car.findByIdAndDelete(id, { model, Year, priceperday, capacity, fuel, transmission, milege, status, color, registrationnumber, location, insurancedetails }, { new: true })




    res.json({ success: true, message: "Car list Deleted successfully", data: deleteCar });

  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Internal server error" })
  }
}

//get total cars
export const getTotalCars = async (req, res) => {
  try {
    const totalCars = await Car.countDocuments(); // Counts total cars in the collection
    res.status(200).json({ total: totalCars });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total cars" });
  }
};









//
export const getAllBookings = async (req, res, next) => {
  try {

    // Fetch all bookings and populate related user and car fields
    const bookings = await Booking.find()
    .populate("carId").populate({
      path: "userId",
      select: "-password", // Removing password
    });


    // Send success response with data
    res.status(200).json({
      success: true,
      message: 'Booking list fetched successfully',
      data: bookings
    });
  } catch (error) {
    // Pass error to global error handler
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Delete a booking by ID
//delete booking
export const deleteBooking = async (req, res, next) => {
  try {
    const { pickuplocation, pickupdate, pickuptime, dropofflocation, dropoffdate, dropofftime, totalcost, paymentstatus, bookingstatus } = req.body
    const { id } = req.params
    const deleteBooking = await Booking.findByIdAndDelete(id, { pickuplocation, pickupdate, pickuptime, dropofflocation, dropoffdate, dropofftime, totalcost, paymentstatus, bookingstatus }, { new: true })

    res.json({ success: true, message: "Booking list Deleted successfully", data: deleteBooking });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "internal server error" })

  }
};

//get all booking count
export const getTotalBooking = async (req, res) => {
  try {
    const totalbooking = await Booking.countDocuments(); // Counts total cars in the collection
    res.status(200).json({ total: totalbooking});
    console.log(totalbooking)
  } catch (error) {
    res.status(500).json({ message: "Error fetching total cars" });
  }
};





//createLocation
export const createLocation = async (req, res, next) => {
  try {
    const { address, city, state, country, zipCode } = req.body;

    if (!address || !city || !state || !country || !zipCode) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newLocation = new Location({
      address,
      city,
      state,
      country,
      zipCode,
    });

    await newLocation.save();

    res.status(201).json({ success: true, message: "Location created successfully", data: newLocation });
  } catch (error) {
    next(error);
  }
};

//review get 


// Get all reviews for a specific car
export const getReviewsByCar = async (req, res, next) => {
  try {
    const { carId } = req.params;

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
//review update
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
    res.status(500).json({ success: false, message: "Failed to update review" });
  }
};




//delete review
export const deleteByReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id)
    // Attempt to delete the review by ID
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      // If no review is found, return a 404 status with a message
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Return success response after deletion
    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
};


//get all review  

export const Adminreviewlist =async (req,res,next)=>{
  try {
      
      const reviewlist = await Review.find().populate("user").populate("car");
      
      res.json({success:true,message:"feetched review list",data:reviewlist});

  } catch (error) {
res.status(error.status||500).json({message:error.message||"Internal server error"})        
  }
}



//get Review count



export const getTotalReview = async (req, res) => {
  try {
    const totalReview = await Review.countDocuments(); // Counts total reviews in the collection
    console.log(totalReview); // Log the correct variable
    res.status(200).json({ total: totalReview }); // Send response after logging
  } catch (error) {
    res.status(500).json({ message: "Error fetching total reviews" });
  }
};





export const allcontact =async (req,res,next)=>{
  try {
      
      const allcontact = await Contact.find();
      
      res.json({success:true,message:"feetched get all list",data:allcontact});

  } catch (error) {
res.status(error.status||500).json({message:error.message||"Internal server error"})        
  }
}


export const confirmPayment = async (req, res) => {
  try {
const{id}=req.params;
    // const bookingid ='66e471ca9d7ea63aa23aa4ff';
    console.log("seen",id);  // Correctly logging bookingid
    
    // Find the booking by ID
    const booking = await Booking.findById(id);
 
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Update booking payment status and confirmation time
    booking.paymentStatus = 'paid';
    booking.confirmedAt = new Date();
    console.log("Updated Booking Data (before save):", booking);
    // Save the updated booking
    await booking.save();
  
    console.log("Updated Booking Data ( save):", booking);
    // Respond with success and updated booking data
    return res.status(200).json({ success: true, message: "Payment confirmed", data: booking });
  } catch (error) {
    // Handle errors and send a response
    return res.status(500).json({ success: false, error: error.message });
  }
};



export const bookingsstatus = async(req,res,next)=>{
  try {
      const{id}=req.params;
        
          console.log("seen",id);  // Correctly logging bookingid
          
          // Find the booking by ID
          const booking = await Booking.findById(id);
     
       
          if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
          }
      
          // Update booking payment status and confirmation time
          booking.bookingStatus = 'confirm';
          booking.confirmedAt = new Date();
          console.log("Updated Booking Data (before save):", booking);
          // Save the updated booking
          await booking.save();
        
          console.log("Updated Booking Data ( save):", booking);
          // Respond with success and updated booking data
          return res.status(200).json({ success: true, message: "Booking confirmed", data: booking });
        } catch (error) {
          // Handle errors and send a response
          return res.status(500).json({ success: false, error: error.message });
        }
      };



export const getPaymentDetails = async (req,res,next)=>{
  try {
    
  } catch (error) {
    
  }
}


