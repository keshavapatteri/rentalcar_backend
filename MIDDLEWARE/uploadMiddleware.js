
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


// import multer from 'multer';
// import path from 'path';

// // Configure storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Specify the folder where you want to store uploaded files
//     cb(null, 'uploads/'); // You may change 'uploads/' to your desired directory
//   },
//   filename: (req, file, cb) => {
//     // Append a timestamp to the original filename to ensure uniqueness
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     const basename = path.basename(file.originalname, ext);
    
//     cb(null, `${basename}-${uniqueSuffix}${ext}`);
//   }
// });

// // Initialize multer with the storage configuration
// const upload = multer({ storage: storage });

// export { upload };
