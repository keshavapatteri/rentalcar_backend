import { Location } from "../MODEL/locationModel.js";



//create location...
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

//get
export const getLocationById = async (req, res, next) => {
    try {
      const {id} = req.params;
  
 
   
      const location = await Location.findById(id);
      
  
      if (!location) {
        return res.status(404).json({ success: false, message: "LOCATION not found" });
      }
  
      // Respond with the payment data if found
      res.status(200).json({ success: true, data: location });
    } catch (error) {
      console.error("Error fetching payment:", error); // More specific error logging
      console.log(error.message);
      //next(error);
    }
  };

//get all
export const getAllLocations= async(req,res,next)=>{
    try {
        const locations = await Location.find();
        res.status(200).json({ success: true, data: locations });
    } catch (error) {
      next(error);  
    }
};
  //update
  export const updateLocationById=async(req,res,next)=>{
    try {
        
    const {id}=req.params;
    const { address, city, state, country, zipCode } = req.body;

    const updatedLocation = await Location.findByIdAndUpdate
    (id,{ address, city, state, country, zipCode },
        { new: true }
      );
      if (!updatedLocation) {
        return res.status(404).json({ success: false, message: "Location not found" });
      }
  
      res.status(200).json({ success: true, message: "Location updated successfully", data: updatedLocation });
    } catch (error) {
        next(error);

    }
}
//delete

export const deleteLocationById=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const { address, city, state, country, zipCode } = req.body;

        const deletedLocation= await Location.findByIdAndDelete(id,{address, city, state, country, zipCode})
        if(!deletedLocation){
            return res.status(400).json({sucess:false,message:"location not found"})
        }
        res.status(200).json({ success: true, message: "Location Deleted successfully", data: deletedLocation });
    } catch (error) {
        next(error)
    }
}