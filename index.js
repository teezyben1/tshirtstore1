const app = require('./app');
const connectToDb = require('./config/db');
const cloudinary = require('cloudinary').v2
const port = process.env.PORT || 3000;

// DB CONNECTION
connectToDb()

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME ,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
}
);