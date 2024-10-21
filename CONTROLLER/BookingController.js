// import { booking } from "../MODEL/bookingModel";
import { Booking} from "../MODEL/bookingModel.js";

export const createbooking = async (req, res, next) => {
    try {
        const { 
            carId,
            userId,
            pickuplocation, 
            pickupdate, 
            pickuptime, 
            dropofflocation, 
            dropoffdate, 
            dropofftime, 
            totalcost
        } = req.body;

        
        const existingBooking = await Booking.findOne({
            carId,
            $or: [
                {
                    pickupdate: { $lte: dropoffdate },
                    dropoffdate: { $gte: pickupdate }
                }
            ]
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: "This car is already booked during the selected dates."
            });
        }

      
        const newBooking = new Booking({
            carId,
            userId,
            pickuplocation, 
            pickupdate, 
            pickuptime, 
            dropofflocation, 
            dropoffdate, 
            dropofftime, 
            totalcost
        });

        // Save to the database
        await newBooking.save();

        // Send success response
        return res.status(201).json({ 
            success: true, 
            message: "New Booking Created successfully", 
            data: newBooking 
        });

    } catch (error) {
        // Handle errors and send an appropriate response
        console.error('Error creating booking:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || "Internal server error" 
        });
    }
};



// update booking
export const updateBooking = async (req, res, next) => {
    try {
        const { pickuplocation, pickupdate, pickuptime, dropofflocation, dropoffdate, dropofftime, totalcost, paymentstatus } = req.body

        const { id } = req.params;
        const updateCar = await Booking.findByIdAndUpdate(id, { pickuplocation, pickupdate, pickuptime, dropofflocation, dropoffdate, dropofftime, totalcost, paymentstatus}, { new: true })




        res.json({ success: true, message: "New booking list Updated successfully", data: updateBooking });

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" })
    }
}

//delete booking
// export const deleteBooking = async (req, res, next) => {
//     try {
//         const {  carId,
//             userId,pickuplocation, pickupdate, pickuptime, dropofflocation, dropoffdate, dropofftime, totalcost, paymentstatus } = req.body
//         const { id } = req.params
//         const deleteBooking = await booking.findByIdAndDelete(id, {  carId,
//             userId,pickuplocation, pickupdate, pickuptime, dropofflocation, dropoffdate, dropofftime, totalcost, paymentstatus}, { new: true })
// console.log(req.params);

//         res.json({ success: true, message: "Booking list Deleted successfully", data: deleteBooking });
//     } catch (error) {
//         res.status(error.status || 500).json({ message: error.message || "internal server error" })

//     }
// }
export const deleteBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({ success: true, message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Route to get a single booking by ID
export const getbookingbyid = async (req, res, next) => {
    try {
        const { id } = req.params;
        const bookingbyid = await Booking.findById(id);

        res.json({ success: true, message: "feetched car list", data: bookingbyid });

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" })
    }
}

//GET ALLBOOKINGS
export const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find().populate("userId").populate("carId");
        console.log(bookings);
        res.json({ success: true, message: 'Booking list fetched', data: bookings });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" })
    }
}



// Function to get bookings by user ID
export const getBookingsByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params; // Assuming userId is passed as a route parameter
        // Find bookings where the userId matches the user's ID
        console.log(userId)
        const bookings = await Booking.find({ userId: userId }).populate("userId").populate("carId");

        // if (bookings.length === 0) {
        //     return res.status(404).json({ success: false, message: "No bookings found for this user" });
        // }

        res.json({ success: true, message: "Fetched bookings", data: bookings });
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error" });
    }
}


//changing the booking status


export const bookingstatus = async(req,res,next)=>{
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
            booking.bookingStatus = 'confirm';
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
        