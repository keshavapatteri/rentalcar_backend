import mongoose from "mongoose";

import { Car } from "../MODEL/carModel.js"
import { cloudinaryInstance } from "../Config/cloudinaryConfig.js";

//carlist
export const getcarlist =async (req,res,next)=>{
    try {
        
        const carlist = await Car.find();
        
        res.json({success:true,message:"feetched car list",data:carlist});

    } catch (error) {
res.status(error.status||500).json({message:error.message||"Internal server error"})        
    }
}

// //create or add new car.....

export const createCar = async (req, res, next) => {
  try {
    const {
      title, model, year, priceperday, capacity, fuel,
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
      title, model, year, priceperday, capacity, fuel,
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

  

// update car
export const updatedCar =async (req,res,next)=>{
    try {

      const{title,model,Year,priceperday,capacity,fuel,transmission,milege,status,color,registrationnumber,location,insurancedetails }=req.body
  
      const {id}=req.params;
      console.log("car-controller",id)
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
  
      const {id}=req.params;
      const deleteCar =await Car.findByIdAndDelete(id,{model,Year,priceperday,capacity,fuel,transmission,milege,status,color,registrationnumber,location,insurancedetails },{new:true})

  


      res.json({success:true,message:"Car list Deleted successfully",data:deleteCar});

    } catch (error) {
res.status(error.status||500).json({message:error.message||"Internal server error"})        
    }
}



// carlist get id details
export const getcarDetails =async (req,res,next)=>{
  try {
      const {id} = req.params;
      const carlist = await Car.findById(id);
      
      res.json({success:true,message:"feetched car list",data:carlist});

  } catch (error) {
res.status(error.status||500).json({message:error.message||"Internal server error"})        
  }
}

//with chat gpt

// export const getcarDetails = async (req, res, next) => {
//   try {
//     const { id } = req.params;
    
//     // Validate the ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Invalid car ID' });
//     }
    
//     const carlist = await Car.findById(id);
    
//     if (!carlist) {
//       return res.status(404).json({ message: 'Car not found' });
//     }

//     res.json({ success: true, message: "Car details fetched successfully", data: carlist });
//   } catch (error) {
//     res.status(error.status || 500).json({ message: error.message || "Internal server error" });
//   }
// };