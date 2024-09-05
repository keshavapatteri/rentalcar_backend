import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
   
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
        
    },
    model: {
        type: String,
        required: true // Add 'required' if necessary
    },
    year: {
        type: Number,
        required: true // Add 'required' if necessary
    },
    priceperday: {
        type: Number,
        required: true // Add 'required' if necessary
    },
    capacity: {
        type: Number,
        required: true // Add 'required' if necessary
    },
    fuel: {
        type: String,
        required: true // Add 'required' if necessary
    },
    transmission: {
        type: String,
        required: true // Add 'required' if necessary
    },
    mileage: {
        type: Number,
        required: true // Fix spelling to "mileage" and add 'required' if necessary
    },
    status: {
        type: String,
        required: true // Add 'required' if necessary
    },
    color: {
        type: String,
        required: true // Add 'required' if necessary
    },
    registrationnumber: {
        type: String,
        required: true // Add 'required' if necessary
    },
    location: {
        type: String,
        required: true // Add 'required' if necessary
    },
    insurancedetails: {
        type: String,
        required: true // Add 'required' if necessary
    }
}, {
    timestamps: true // Optional: Adds createdAt and updatedAt fields automatically
});

export const Car = mongoose.model('Car', carSchema)