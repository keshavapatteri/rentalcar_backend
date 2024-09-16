import express from 'express'
import { authUser } from '../../MIDDLEWARE/authUser.js';
import { createLocation, deleteLocationById, getAllLocations, getLocationById, updateLocationById,  } from '../../CONTROLLER/locationController.js';

const router = express.Router()
//create a location
router.post("/create",authUser,createLocation);//admin
router.get("/getLocation/:id",getLocationById)
// Route to get all locations
router.get("/getall", getAllLocations);
//// Route to update a location by ID
router.put("/update/:id",  updateLocationById); //adminAuth,

// Route to delete a location by ID
router.delete("/delete/:id",  deleteLocationById); //adminAuth,







export default router;