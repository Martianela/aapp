const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../schemas/userSchema");

//Register
router.post("/register", async (req, res) => {
  try {
    if (req.body.password === req.body.confirmPassword) {
      const password = req.body.password;

      // Generate a salt
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);

      // Hash the password
      const hash = bcrypt.hashSync(password, salt);

      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
      });
      console.log(newUser);

      const user = await newUser.save();
      res.status(201).json(user);
      console.log(hash); // This is the hashed password
    } else {
      res
        .status(500)
        .json({ message: "Password does not match confirm password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const newUser = await User.findOne({ email: req.body.email });
    console.log(newUser);
    console.log(password);
    if (newUser) {
      if (bcrypt.compareSync(password, newUser.password)) {
        let uid = newUser["_id"];
        let token = jwt.sign({ payload: uid }, "secrate");
        res.cookie("leetcodelogin", token, {
          httpOnly: true,
          secure: false,
          maxAge: 1000 * 360 * 24365 * 7,
        });
        return res.status(200).json({
          message: "user loged in successfully",
          data: {
            name: newUser.firstName + newUser.lastName,
            email: newUser.email,
          },
        });
      } else {
        return res.status(403).json({
          message: "Invalid password",
        });
      }
    } else {
      return res.status(401).json({ message: "invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/logout", (req, res) => {
  res.cookie("leetcodelogin", " ", { maxAge: 1 });
  res.json({ message: "logut sucessfully" });
});
module.exports = router;
