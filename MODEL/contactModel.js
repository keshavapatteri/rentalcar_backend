import mongoose from "mongoose";



const contactSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  username: {
    type: String,
    required: true,
    
  },
  phonenumber: {
    type: Number,
    required: true,
   
  },
  email: {
    type: String,
    required: true,
    
  },
  usertext: {
    type: String,
    required: true,
  
  },
  
}, { timestamps: true });


export const Contact = mongoose.model("Contact", contactSchema);


