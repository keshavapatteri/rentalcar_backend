import { Payment } from '../MODEL/paymentModel.js'
 import { booking } from "../MODEL/bookingModel.js";
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
  
      const payments = await Payment.find({ user: userId }).populate("booking");
  
      if (!payments || payments.length === 0) {
        return res.status(404).json({ success: false, message: "No payments found for this user" });
      }
  
      res.status(200).json({ success: true, data: payments });
    } catch (error) {
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
            success_url: `${process.env.client_domain}/user/success`,
            cancel_url: `${process.env.client_domain}/user/cancel`,
        });

        console.log('sessionId====', session.id);
        
        res.json({ success: true, sessionId: session.id });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
    
};
