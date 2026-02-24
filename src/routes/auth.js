const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authrouter = express.Router();
const JWT_SECRET = "backend"; 

authrouter.post("/signup", async (req, res) => {
    try {
        const { password, firstname, lastname, email,photourl,gender,about,age } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            photourl: photourl || "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/1280px-Unknown_person.jpg?20200423155822",
            gender ,
            about:about || "This user prefers to keep an air of mystery about them.",
            age: age || 18
        });

        await user.save();
        res.status(201).json({ message: "User Registered Successfully",user: { firstname, lastname, email, photourl: user.photourl, gender, about, age }  });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

authrouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;  // <-- use email here

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });  // <-- match by email
    if (!user) {
      return res.status(400).json({ error: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 86400000) });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({ message: "Login Successful", user: userResponse });
  } catch (err) {
  res.status(500).json({ error: "Internal Server Error" });
  }
});

authrouter.post("/logout", (req, res) => {
    res.cookie("token", "", { expires: new Date(0) }); // Clear cookie properly
    res.status(200).json({ message: "Logged out successfully" });
});

module.exports = authrouter;