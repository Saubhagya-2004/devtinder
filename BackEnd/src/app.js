require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require("express"); // Import express module
const connectDB = require("./config/database");
const app = express(); // Create an express application
//first connect to the database then listen to the server
const User = require("./models/user");
//cookies token
const cookiesparser = require("cookie-parser");
//jsonwebtoken jwt
const jwt = require("jsonwebtoken");
//validation
const { validation } = require("./utils/validation");
//use express middle-ware
app.use(express.json());
app.use(cookiesparser());
//authentication middleware
const { userAuth } = require("./middlewares/auth");
const user = require("./models/user");
//encrypt password
const bcrypt = require("bcrypt");
const authRouter = require("./Routes/authroutes");
const profileRouter = require("./Routes/profileRouter");
const connectionreq = require("./Routes/connectionreq");

const UserRequest = require("./Routes/UserRequest");
//socket
const http = require('http')
//use cors
const cors = require("cors");
const intializesocket = require("./utils/socket");
const chatRouter = require("./Routes/chat");

// Enable CORS for all incoming requests
app.use(cors({
  origin: true, // Allow all origins for now to simplify Netlify deployment
  credentials: true
}));


//login user
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionreq);
app.use("/", UserRequest);
app.use("/", chatRouter)
app.get("/", (req, res) => {
  res.send("Welcome to the home page");
});

//socket connec
const server = http.createServer(app);
intializesocket(server);




connectDB()
  .then(() => {
    console.log("Database connection sucessfully...");
    server.listen(process.env.PORT, () => {
      console.log("Server connected successfully on port " + process.env.PORT);

    });
  })
  .catch((err) => {
    console.error("database cannot be connected");
  });
