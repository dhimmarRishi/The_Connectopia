const express = require("express");
const dotenv = require("dotenv");
const { mongoose } = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { handleRegister } = require("./Handlers/handleAuth");
const { handleUserLogin } = require("./Handlers/handleAuth");
const cookieParser = require("cookie-parser");
const { userRouter } = require("./routes/User");
const { verifyToken } = require("./Middleware/jwtAuth");
const { postRouter } = require("./routes/Post");
//-------------------------------

const app = express();


app.use(cors({
  // origin : 'https://connectopia2004.netlify.app',
  origin : 'http://localhost:3000',
  credentials : true
}));

dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(express.static('public'))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, "pfp_" + Date.now().toString() + "_" + file.originalname);
  },
});


const upload = multer({storage : storage} );
const PORT = process.env.PORT || 6000;
//----------------------------------------

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Connected to Db and server running on " + PORT);
    });
  })
  .catch((err) => console.log(err));



app.post("/auth/register", upload.single("file"), handleRegister);
app.post("/auth/login", handleUserLogin);
app.use("/user",verifyToken, userRouter);
app.use("/post",verifyToken, postRouter)
