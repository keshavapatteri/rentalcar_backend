
import multer from 'multer';
import path from 'path';

// Configure storage
const storage = multer.diskStorage({
 
  filename: (req, file, cb) => {
   
    
   
    cb(null,file.originalname); // Unique filename
  }
});

const upload = multer({ storage: storage });

export { upload };
