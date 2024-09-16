import { Payment } from '../MODEL/paymentModel.js'
 import {  Booking } from "../MODEL/bookingModel.js";
 import { Stripe } from 'stripe';
import { config } from 'dotenv';

config();




export const getPaymentByBookingId = async (req, res, next) => {
    try {
      const { paymentId } = req.params;
  
      // Find the payment by ID and populate the associated Booking
      const payment = await Payment.findById(paymentId).populate("booking");
      console.log("payment===>", payment);
  
      if (!payment) {
        return res.status(404).json({ success: false, message: "Payment not found" });
      }
  
      // Respond with the payment data if found
      res.status(200).json({ success: true, data: payment });
    } catch (error) {
      console.error("Error fetching payment:", error); // More specific error logging
      console.log(error.message);
      //next(error);
    }
  };
  
// to get all payments by user ID
export const getPaymentsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Retrieve payments associated with the user from your database
    const payments = await Payment.find({ user: userId }).populate("booking");

    if (!payments || payments.length === 0) {
      return res.status(404).json({ success: false, message: "No payments found for this user" });
    }

    // Retrieve additional details from Stripe for each payment (if needed)
    const stripePayments = await Promise.all(payments.map(async (payment) => {
      try {
        const stripePayment = await stripe.paymentIntents.retrieve(payment.stripePaymentId);
        return {
          ...payment.toObject(), // Convert Mongoose document to plain object
          stripe: {
            id: stripePayment.id,
            amount: stripePayment.amount_received,
            status: stripePayment.status,
          }
        };
      } catch (error) {
        // Handle error retrieving Stripe payment details
        return {
          ...payment.toObject(),
          stripe: {
            id: payment.stripePaymentId,
            amount: null,
            status: 'unknown',
          }
        };
      }
    }));

    // Return the payments data with Stripe details
    res.status(200).json({ success: true, data: stripePayments });
  } catch (error) {
    // Pass any errors to the global error handler
    next(error);
  }
};



  //update-payment
 export const updatedPayment = async (req, res) => {
    const { paymentId } = req.params;
    const updateData = req.body;

    try {
        const updatedPayment = await Payment.findByIdAndUpdate(paymentId, updateData, { new: true });
        
        if (!updatedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(500).json({ message: "Error updating payment", error: error.message });
    }
};


  
  // Controller to delete a payment
  export const deletePayment = async (req, res) => {
      const { paymentId } = req.params;
  
      try {
          const deletedPayment = await Payment.findByIdAndDelete(paymentId);
          
          if (!deletedPayment) {
              return res.status(404).json({ message: "Payment not found" });
          }
  
          res.status(200).json({ message: "Payment deleted successfully" });
      } catch (error) {
          res.status(500).json({ message: "Error deleting payment", error: error.message });
      }
  };




const stripe = new Stripe(process.env.Stripe_Private_Api_Key);

export const processPayment = async (req, res, next) => {
    try {
        const {bookingData,totalCost} = req.body;
        console.log("Request body:", req.body);
        const lineItems = [{
          price_data: {
              currency: 'inr', // Currency set to Indian Rupees
              product_data: {
                  name: `Pickup Location :${bookingData.pickuplocation}.PickUpDate:${bookingData.pickupdate}. PickupTime:${bookingData.pickuptime}`, // Combined pickup location and date
                  description: `Dropofflocation: ${bookingData.dropofflocation}. DropoffDate: ${bookingData.dropoffdate}. DropoffTime: ${bookingData.dropofftime}`, // Pickup time as the description
              },
              unit_amount: Math.round(totalCost * 100), // The price is multiplied by 100 to convert to the smallest currency unit (e.g., paise for INR)
          },
          quantity: 1, // Quantity of the item being purchased
      }];
      

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.REACT_APP_PAYMENT_SUCCESS_URL}/user/success`,
            cancel_url: `${process.env.REACT_APP_PAYMENT_SUCCESS_URL}/user/cancel`,
        });
console.log(`########stripe res`, session)
 // Save payment details to MongoDB
 const payment = new Payment({
  sessionId: session.id,
 ////////////////////////////////////////////////////check
 
  paymentStatus: 'pending' // Initially set to 'pending'
});

await payment.save();



        console.log('sessionId====', session.id);
        
        res.json({ success: true, sessionId: session.id });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
    
};

// NEW CODE CHANGE TO  BOOKING STATUS
export const confirmpayments = async (req, res) => {
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

//get booking by id

//updatebooking

export const updatebooking = async (req, res, next) => {
  try {
    let { id } = req.params;
    
    // Trim any leading or trailing whitespace from the id
    id = id.trim();
    
    console.log(req.params);
    
    // Find booking by id
    const bookingbyid = await Booking.findById(id);

    if (!bookingbyid) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, message: "Fetched booking details", data: bookingbyid });
    console.log(bookingbyid);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
