import express from 'express'
import userRouter from './userRouter.js'
import carRouter from './carRouter.js'
import adminRouter from './adminRouter.js'
import paymentRouter from './paymentRouter.js'
import bookingRouter from './bookingRouter.js'
import reviewRouter from './reviewRoutes.js'
import wishlistRouter from './wishlistRouter.js'
import locationRouter from './locationRoutes.js'
import contactRouter from './contactRouter.js'
import nodemailerRouter from './nodemailerRouter.js'
const v1Router = express.Router();

v1Router.use('/user',userRouter)
v1Router.use('/car',carRouter)
 v1Router.use('/admin',adminRouter)
v1Router.use('/payment',paymentRouter)
v1Router.use('/booking',bookingRouter)
v1Router.use('/review',reviewRouter)
v1Router.use('/wishlist',wishlistRouter)
v1Router.use('/location',locationRouter)
v1Router.use('/contact',contactRouter)
v1Router.use('/nodemailer',nodemailerRouter)
export default v1Router; 