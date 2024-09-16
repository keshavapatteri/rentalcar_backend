import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  
  carId: { type: mongoose.Schema.Types.ObjectId,
     ref: 'Car', 
     required: true },
  
    userId: { type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
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

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'], // Define the allowed values for paymentStatus
      default: 'pending' // Set default value
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirm', 'failed'], // Define the allowed values for paymentStatus
      default: 'pending' // Set default value
    },

  confirmedAt: {
    type: Date
  }

   
  }, { timestamps: true }); // Add timestamps for createdAt and updatedAt
  

// export const booking = mongoose.model('booking',bookingSchema)

export const Booking = mongoose.model('Booking', bookingSchema);