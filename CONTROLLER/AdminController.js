
import bcrypt from "bcrypt"
import {generateAdminToken} from '../UTILITIS/generateAdminToken.js';
import {Admin} from '../MODEL/adminModel.js';
import { User } from "../MODEL/userModel.js";
import { Car } from "../MODEL/carModel.js"
import { booking } from "../MODEL/bookingModel.js";
import {Review} from "../MODEL/reviewModel.js";
import { cloudinaryInstance } from "../Config/cloudinaryConfig.js";

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
export const AdminProfile = async (req,res, next) => {
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

      // Set token in an HTTP-only cookie
      res.cookie("token", token, {
          httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
          secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
          maxAge: 24 * 60 * 60 * 1000, // Sets cookie expiration time (e.g., 1 day)
          sameSite: 'Strict', // Helps prevent CSRF attacks
      });

      // Send response
      return res.json({ success: true, message: "Admin login successful", status: 200, token });
  } catch (error) {
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
};
//logout
 export const AdminLogout=async(req,res,next)=>{

  res.clearCookie("token")
  res.json({success:true,message:'Admin logged out successfully'})
  

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
  export const updateUser =async (req,res,next)=>{
    try {
      const{username,email,password}=req.body
  
      const {id}=req.params;
      const updateUser =await User.findByIdAndUpdate(id,{username,email,password},{new:true})


      res.json({success:true,message:"New car list Updated successfully",data:updateUser});

    } catch (error) {
res.status(error.status||500).json({message:error.message||"Internal server error"})        
    }
}



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
    const { title, model, year, priceperday, capacity, fuel, transmission, mileage, status, color, registrationnumber, location, insurancedetails } = req.body;
    const image = req.file ? req.file.path : null; // Get the file path from the uploaded file
    console.log('image===',req.file);

//cloudinary
const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path).catch((error)=>{
  console.log(error);
 
  
});
console.log(uploadResult);

    // Check if any field is missing
    if (!title || !model || !year || !priceperday || !capacity || !fuel || !transmission || !mileage || !status || !color || !registrationnumber || !location || !insurancedetails || !image) {
      return res.status(400).json({ success: false, message:error.message });
    }

    // Create a new car instance with the image field
    const newCar = new Car({
      title, model, year, priceperday, capacity, fuel, transmission, mileage, status, color, registrationnumber, location, insurancedetails, image
    });

    // Save the new car to the database
    await newCar.save();

    // Send success response
    return res.json({ success: true, message: "New car created successfully", data: newCar });

  } catch (error) {
    // Send error response
    res.status(500).json({ success: false, message: 'Failed to add car', error: error.message }); // Using next to handle the error middleware
  }
};

  // update car
export const updateCar =async (req,res,next)=>{
  try {
    console.log(`hhhh`)
    const{title,model,Year,priceperday,capacity,fuel,transmission,milege,status,color,registrationnumber,location,insurancedetails }=req.body

    const {id}=req.query;
    console.log('req.query====>',req.query);
    const updateCar =await Car.findByIdAndUpdate(id,{title,model,Year,priceperday,capacity,fuel,transmission,milege,status,color,registrationnumber,location,insurancedetails },{new:true})

    


    res.json({success:true,message:"New car list Updated successfully",data:updateCar});

  } catch (error) {
res.status(error.status||500).json({message:error.message||"Internal server error"})        
  }
}


//delete car
export const deleteCar =async (req,res,next)=>{
    try {
      const{model,Year,priceperday,capacity,fuel,transmission,milege,status,color,registrationnumber,location,insurancedetails }=req.body
      // const {id}=req.query;
      const {id}=req.params;
      const deleteCar =await Car.findByIdAndDelete(id,{model,Year,priceperday,capacity,fuel,transmission,milege,status,color,registrationnumber,location,insurancedetails },{new:true})

  


      res.json({success:true,message:"Car list Deleted successfully",data:deleteCar});

    } catch (error) {
res.status(error.status||500).json({message:error.message||"Internal server error"})        
    }
}


//
export const getAllBookings = async (req, res, next) => {
  try {
    // Fetch all bookings and populate related user and car fields
    const bookings = await booking.find()


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
        const deleteBooking = await booking.findByIdAndDelete(id, { pickuplocation, pickupdate, pickuptime, dropofflocation, dropoffdate, dropofftime, totalcost, paymentstatus, bookingstatus }, { new: true })

        res.json({ success: true, message: "Booking list Deleted successfully", data: deleteBooking });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "internal server error" })

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
          res.status(500).json({ success: false, message: "Failed to update review" });
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
    

