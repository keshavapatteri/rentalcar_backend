// import { booking } from "../MODEL/bookingModel";
import { booking } from "../MODEL/bookingModel.js";

export const createbooking = async (req, res, next) => {
    try {
        const { 
            carId,
            pickuplocation, 
            pickupdate, 
            pickuptime, 
            dropofflocation, 
            dropoffdate, 
            dropofftime, 
            totalcost, 
           
        } = req.body;

        // Check if all required fields are provided
        // if (!pickuplocation || !pickupdate || !pickuptime || !dropofflocation || !dropoffdate || !dropofftime || !totalcost ) {
        //     return res.status(400).json({ success: false, message: 'All fields are required' });
        // }

        // Create a new booking instance
        const newBooking = new booking({
            carId,
            pickuplocation, 
            pickupdate, 
            pickuptime, 
            dropofflocation, 
            dropoffdate, 
            dropofftime, 
            totalcost, 
           
        });

        // Save to the database
        await newBooking.save();

        // Send success response
        return res.status(201).json({ success: true, message: "New Booking Created successfully", data: newBooking });

    } catch (error) {
        // Handle errors and send an appropriate response
        console.error('Error creating booking:', error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

// export const createbooking = async (req, res, next) => {
//     try {
//         const { 
//             carId,              // Add carId to destructured properties
//             pickuplocation, 
//             pickupdate, 
//             pickuptime, 
//             dropofflocation, 
//             dropoffdate, 
//             dropofftime, 
//             totalcost 
//         } = req.body;

//         // Check if all required fields are provided
//         // if (!carId || !pickuplocation || !pickupdate || !pickuptime || !dropofflocation || !dropoffdate || !dropofftime || totalcost === undefined || totalcost === null) {
//         //     return res.status(400).json({ success: false, message: 'All fields are required' });
//         // }

//         // Ensure totalcost is a number
//         const parsedTotalCost = parseFloat(totalcost);
//         if (isNaN(parsedTotalCost)) {
//             return res.status(400).json({ success: false, message: 'Total cost must be a valid number' });
//         }

//         // Create a new booking instance
//         const newBooking = new booking({
//             carId,              // Include carId in the booking
//             pickuplocation, 
//             pickupdate, 
//             pickuptime, 
//             dropofflocation, 
//             dropoffdate, 
//             dropofftime, 
//             totalcost: parsedTotalCost // Save as number
//         });

//         // Save to the database
//         await newBooking.save();

//         // Send success response
//         return res.status(201).json({ success: true, message: "New Booking Created successfully", data: newBooking });

//     } catch (error) {
//         // Handle errors and send an appropriate response
//         console.error('Error creating booking:', error);
//         return res.status(500).json({ success: false, message: error.message || "Internal server error" });
//     }
// };



// update booking
export const updateBooking = async (req, res, next) => {
    try {
        const { pickuplocation, pickupdate, pickuptime, dropofflocation, dropoffdate, dropofftime, totalcost, paymentstatus } = req.body

        const { id } = req.params;
        const updateCar = await booking.findByIdAndUpdate(id, { pickuplocation, pickupdate, pickuptime, dropofflocation, dropoffdate, dropofftime, totalcost, paymentstatus}, { new: true })




        res.json({ success: true, message: "New booking list Updated successfully", data: updateBooking });

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" })
    }
}

//delete booking
export const deleteBooking = async (req, res, next) => {
    try {
        const { pickuplocation, pickupdate, pickuptime, dropofflocation, dropoffdate, dropofftime, totalcost, paymentstatus } = req.body
        const { id } = req.params
        const deleteBooking = await booking.findByIdAndDelete(id, { pickuplocation, pickupdate, pickuptime, dropofflocation, dropoffdate, dropofftime, totalcost, paymentstatus}, { new: true })

        res.json({ success: true, message: "Booking list Deleted successfully", data: deleteBooking });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "internal server error" })

    }
}

// Route to get a single booking by ID
export const getbookingbyid = async (req, res, next) => {
    try {
        const { id } = req.params;
        const bookingbyid = await booking.findById(id);

        res.json({ success: true, message: "feetched car list", data: bookingbyid });

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" })
    }
}

//GET ALLBOOKINGS
export const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await booking.find();
        console.log(bookings);
        res.json({ success: true, message: 'Booking list fetched', data: bookings });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" })
    }
}