import express from 'express'
import { createbooking, deleteBooking, getAllBookings, getbookingbyid, updateBooking } from '../../CONTROLLER/BookingController.js';
const router = express.Router()


//create
router.post ('/create',createbooking)
//get
// router.get('/bookinglist',getbookinglist) //aldready called on below by -allbookings
//update
router.put('/updatebooking/:id',updateBooking)
//delete
router.delete('/deletebooking/:id',deleteBooking)
// Route to get a single booking by ID

router.get('/getbooking/:id',getbookingbyid)

router.get('/allBookings',getAllBookings)


export default router;