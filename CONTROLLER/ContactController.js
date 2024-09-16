import {Contact} from "../MODEL/contactModel.js"



//creating


export const createContact = async (req, res, next) => {
  try {
    const { userId,username,usertext,phonenumber,email } = req.body;

    if (!userId|| !username|| !usertext||!phonenumber|| !email) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newContact = new Contact({
      userId,username,usertext,phonenumber,email
    });

    await newContact.save();

    res.status(201).json({ success: true, message: "contact created successfully", data: newContact });
  } catch (error) {
    next(error);
    }
  };


  //get all 



  export const getallcontact =async (req,res,next)=>{
    try {
        
        const allcontact = await Contact.find();
        
        res.json({success:true,message:"feetched get all list",data:allcontact});
  
    } catch (error) {
  res.status(error.status||500).json({message:error.message||"Internal server error"})        
    }
  }