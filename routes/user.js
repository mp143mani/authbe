const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { dbUrl } = require("../dbConfig");
const { UserModel } = require("../schema/UserSchema");
const { createToken, validate, adminGurd,hashPassword,comparePassword } = require("../auth");

mongoose.connect(dbUrl);

router.get("/", (req, res) => {
  res.send(`
     <h1> My Routes</h1>
     <h4>GET/user/ all users</h4>
     <h4>GET/user/:id</h4>
     <h4>POST/user/signup</h4>
     <h4>POST/user/sign in</h4>
     <h4>POST/user/change-password/:id</h4>
    `);
});

router.get("/all", validate, adminGurd, async (req, res) => {
  try {
    let users = await UserModel.find();
    res.status(200).send({
      message: "Data Fetch Successfull",
      users,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {

       req.body.password =  await hashPassword(req.body.password)
      let newUser = await UserModel.create(req.body);
      res.status(200).send({ message: "User Created Successfully" });
    } else {
      res
        .status(400)
        .send({ message: `User with ${req.body.email} already exists` });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error?.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      if (await comparePassword(req.body.password,user.password)) {
        let token = await createToken(user);
        res.status(200).send({
          message: "login successful",
          token,
        });
      } else {
        res.status(400).send({ message: "Invalid data" });
      }
    } else {
      res
        .status(400)
        .send({ message: `User with ${req.body.email} does not exists` });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error?.message,
    });
  }
});

router.post("/change-password/:id",validate, async (req, res) => {
  try {
    let user = await UserModel.findById(req.params.id);
    if (user)
     {
         if (await comparePassword(req.body.current_password,user.password))
        {
          user.password = await hashPassword(req.body.new_password)
             user.save()
            res.status(200).send({
            message: "Password changed successful"
        });
      }
       else 
       {
        res.status(400).send({ message: "Invalid password" });
      }
    } else {
      res
        .status(400)
        .send({ message: `User  does not exists` });
    }
  } catch (error) {

    res.status(500).send({
      message: "Internal Server Error",
      error: error?.message
    });
  }
});

router.get("/:id", validate, async (req, res) => {
  try {
    let data = await UserModel.findById(req.params.id);
    if (data) {
      res.status(200).send({
        message: "Data Fetch Successfull",
        data,
      });
    } else {
      res.status(400).send({ message: "Invalid Id" });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
