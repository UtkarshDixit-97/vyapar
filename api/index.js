// import express for server
const express = require("express");

const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const multer = require("multer")
const path = require("path")
const cron = require('node-cron');
// importing routes
const product = require("./routes/product.js")
const user = require("./routes/user.js")
const auth = require("./routes/auth.js")
const seller = require("./routes/seller.js")
const reviews = require("./routes/reviews.js")
const order = require("./routes/order.js")
const cart = require("./routes/cart.js")



// importing order model
const Order = require('./models/Order')


// requiring this to delete a file after it has been uploaded
const fs = require("fs")



// Initialise express server to const app
const app = express();

// now we can fetch our images and other media using this url = eg - lh:3001/images/filename.jpg
app.use("/images",express.static(path.join(__dirname,"public/images")))

// using helemt for secure request calls
app.use(helmet());

// using morgan for better logging
app.use(morgan('common'));

// using cors for inter-domain request - Cross Origin Resource Sharing
app.use(cors());

dotenv.config();
console.log(process.env.DB_URL)
mongoose.connect(process.env.DB_URL , {useNewUrlParser : true , useUnifiedTopology : true})
  .then(() => console.log('Mongo connection established to Vyapar App'))
  .catch((err) => console.log(err))

// askign the app to use json parsing which comes pre-bulit in expres
app.use(express.json());

// Starting the server
app.listen(process.env.PORT || 3001,() => console.log(`we are running on ${process.env.PORT || 3001}`));


// Initialising root route
app.get('/',(req,res) => {
  res.end("Hello , the Vyapar app is running ... ");
})
// all routes
app.use('/api/product',product);
app.use('/api/user',user);
app.use('/api/auth',auth);
app.use('/api/seller',seller);
app.use('/api/review',reviews);
app.use('/api/order',order);
app.use('/api/cart',cart);





// setting the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
    // cb(null, req.originalname);
    // cb(null, file.originalname);
  },
});

// telling the middleware(upload) to use multer storage
const upload = multer({ storage: storage });

// single file upload for main product image
app.post("/api/upload/single", upload.single("file"), (req, res) => {
  try {
    console.log(req.body)
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

// // single file upload for multiple uploads usefull for product upload image
// app.post("/api/upload/many", upload.array("file"), (req, res) => {
//   try {
//     console.log(req.body)
//     return res.status(200).json("File uploded successfully");
//   } catch (error) {
//     console.error(error);
//   }
// });


// delete an uploaded file
app.post("/api/upload/delete", (req, res) => {
  const oldPath = path.join(__dirname,"public/images",req.body.filename);
  try {
    fs.unlinkSync(oldPath)
    return res.status(200).json("File delete");
  } catch (error) {
    console.error(error);
  }
});



// Running the cron job
