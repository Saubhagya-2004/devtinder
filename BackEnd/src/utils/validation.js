const validator = require("validator");
const validation = (req) => {
  const allowed = [
    "profile",
    "age",
    "skills",
    "firstName",
    "lastName",
    "email",
    "password",
    "profession",
    "gender",
    "Bio",
    "language",
  ];
  const isAllowed = Object.keys(req.body).every((key) => {
    return allowed.includes(key);
  });
  if (!isAllowed) {
    throw new Error("Invalid request");
  }

}; 
const validateprofileEdit = (req)=>{
  const allowed =[
    "profile",
    "age",
    "skills",
    "firstName",
    "lastName",
    "gender",
    "Bio",
    "Language",
    "profession"
  ];
  const isallowed = Object.keys(req.body).every((key)=>{
    return allowed.includes(key);
  });
  if(!isallowed){
    throw new Error("Invalid request");
  } 
}
const validatepasswordEdit = (req) => {
  const allowed = ["password"];
  const isallowed = Object.keys(req.body).every((key) => {
    return allowed.includes(key);
  });
  if (!isallowed) {
    throw new Error("Invalid request");
  }
}
module.exports = {
  validation,
  validateprofileEdit,
  validatepasswordEdit
};
