import express from 'express';
import { createContact, getallcontact } from '../../CONTROLLER/ContactController.js';



const router = express.Router();

//to create contact

router.post('/create-contact',createContact)

router.get('/allcontact',getallcontact)




export default router;