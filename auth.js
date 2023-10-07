const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRound = 10;

let hashPassword = async (password) =>{
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword
}

 let comparePassword =async (password,hashedPassword)=>{
    return bcrypt.compare(password,hashedPassword)
 }

let createToken = async ({ email, role, name, _id }) => {
  let token = await jwt.sign(
    { email, role, name, id: _id },
    process.env.JWT_SK,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
  //   console.log(token);
  return token;
};

let decodeToken = async (token) => {
  // decoding the JWT
  return jwt.decode(token);
};

let validate = async (req, res, next) => {
  // validate is token is not expired
  // console.log(req.headers.authorization)
  let token = req?.headers?.authorization?.split(" ")[1];
  // console.log(token)
  if (token) {
    let { exp } = await decodeToken(token);
    if (Math.round(+new Date() / 1000) < exp) next();
    else {
      res.status(401).send({ message: "token expired" });
    }
  } else {
    res.status(401).send({ message: "token not found" });
  }
};

let adminGurd = async (req, res,next) => {
  // alow only admin access
  let token = req?.headers?.authorization?.split(" ")[1];
  // console.log(token)
  if (token)
   {
    let { role } = await decodeToken(token);
    if (role === "admin")
     next()
    else {
      res.status(401).send({ message: "only admin can access" });
    }
  } else {
    res.status(401).send({ message: "token not found" });
  }
};

module.exports = { createToken, validate, adminGurd,hashPassword,comparePassword};
