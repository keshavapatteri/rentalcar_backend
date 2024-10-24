import express from 'express';
import apiRouter from './ROUTES/index.js';
import { connectDB } from './Config/db.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors({
    origin: 'https://rentalcar-frontend.vercel.app',
    credentials: true,
}));
//

//http://localhost:5173 
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(cookieParser());

// Connect to the database
connectDB();

// Route for the homepage
app.get('/', (req, res) => {  
    res.send('Hello World');
});

// API routes
app.use('/api', apiRouter);

// Start the server
const port = process.env.PORT || 4500; // Ensure a default port is set
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});