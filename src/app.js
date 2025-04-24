const express = require("express"); // Import express module
const connectDB = require("./config/database");
const app = express(); // Create an express application
//first connect to the database then listen to the server
const User = require("./models/user");

//use express middle-ware
app.use(express.json());
//authentication
const { admin, userAuth } = require("./middlewares/auth");

app.use("/admin", admin,(req,res)=>{
    res.send("Admin route accessed successfully");
}); //use admin middleware for all routes starting with /admin

//user authentication
app.get("/user", userAuth, (req, res) => {
  res.send({ firstName: "Saubhagya", LastName: "Baliarsingh" });
});
app.post("/signup", async (req, res) => {
  //return a promise so use async
  //creating a new instance of usermodel dynamic
  const user = new User(req.body);
  console.log(user);

  //always wrap it inside try catch
  try {
    await user.save();
    res.send("user added sucessfully");
  } catch (err) {
    res.status(400).send("Error saving the message", +err.message);
  }
});
app.delete("/user", async (req, res) => {
  try {
    res.send("user deleted sucessfully");
  } catch {
    res.status(400).send("Error deleting the message");
  }
});
connectDB()
  .then(() => {
    console.log("Database connection sucessfully...");
    app.listen(8888, () => {
      console.log("Server connected successfully on port 8888");
    });
  })
  .catch((err) => {
    console.error("database cannot be connected");
  });
