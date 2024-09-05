import express from 'express'
const router = express.Router()
import { authUser } from '../../MIDDLEWARE/authUser.js';
import { deletePayment, getPaymentByBookingId, getPaymentsByUserId, processPayment, updatedPayment } from '../../CONTROLLER/PaymentController.js';
// Route to process a payment
router.post("/create",processPayment);    //authUser 
// Route to get payment details by booking ID
router.get("/booking/:paymentId",authUser, getPaymentByBookingId);
// Route to get all payments by user ID
router.get("/getall/:userId",authUser, getPaymentsByUserId);
//route-update
router.put("/update/:paymentId",authUser, updatedPayment);
// Route to delete a payment by payment ID
router.delete("/delete/:paymentId",authUser , deletePayment);


export default router;