import express from 'express'
import { Createmessage } from '../../CONTROLLER/NodeMailerController.js';
const router = express.Router();

router.post("/create-message",Createmessage);


export default router;