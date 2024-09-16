import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({

  sessionId: {
    type: String,
    required: true,
},
carDetails: {
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        
    },
    brand: String,
    model: String,
    availability: String,
},
totalCost: {
    type: Number,
    
},
// paymentStatus: {
//     type: String,
//     default: 'pending', // payment status can be 'pending', 'paid', 'failed'
// },
paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'], // Define the allowed values for paymentStatus
    default: 'pending' // Set default value
  },
confirmedAt: { // Added field to track payment confirmation date
    type: Date,
},
}, {
timestamps: true,
});

  


export const Payment= mongoose.model('Payment',paymentSchema)