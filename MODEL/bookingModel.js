import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId,
     ref: 'Car', 
     required: true },
    pickuplocation: {
      type: String,
      required: true,
      trim: true,
    },
    pickupdate: {
      type: Date,
      required: true,
    },
    pickuptime: {
      type: String, // Use String if storing time in 'HH:mm' format, otherwise use Date
      required: true,
    },
    dropofflocation: {
      type: String,
      required: true,
      trim: true,
    },
    dropoffdate: {
      type: Date,
      required: true,
    },
    dropofftime: {
      type: String, // Use String if storing time in 'HH:mm' format, otherwise use Date
      required: true,
    },
    totalcost: {
      type: Number, // Store as a Number to perform calculations if necessary
      required: true,
    },
   
   
  }, { timestamps: true }); // Add timestamps for createdAt and updatedAt
  

export const booking = mongoose.model('booking',bookingSchema)