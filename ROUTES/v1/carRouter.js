import express from 'express';
import { createCar, deleteCar, getcarDetails, getcarlist, updatedCar } from '../../CONTROLLER/carController.js';
import { AddCar, updateCar } from '../../CONTROLLER/AdminController.js';
import { authAdmin } from '../../MIDDLEWARE/authAdmin.js';
import { authUser } from '../../MIDDLEWARE/authUser.js';
 import { upload } from '../../MIDDLEWARE/uploadMiddleware.js';

const router = express.Router();

// Route to get the car list
router.get('/carlist', getcarlist);

// Route to create a new car - order matters, so ensure AddCar should precede createCar if it makes sense
router.post('/create',upload.single("image"),  authUser,  createCar); //AddCar,

// Route to update an existing car
router.put('/update/:id', authUser, updatedCar, updateCar);

// Route to delete a car
router.delete('/delete/:id', authUser, deleteCar);

//get id deatils

router.get('/details/:id', getcarDetails);



export default router;
