const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const auth = require("../middleware/auth"); // Dodato: Uvoz auth middleware-a

router.post("/register", async (req, res) => {
  process.stdout.write("Register route hit - using stdout\n");

  try {
    process.stdout.write("Register route hit - inside try\n");

    // Ekstraktujemo podatke iz tela zahteva
    const { username, email, password } = req.body;

    const user = new User({
      username,
      email,
      password,
      role: "user", // Dodajemo polje role sa vrednošću 'user'
    });

    // Čuvamo korisnika u bazi
    console.log("User object before saving:", user); // Pre čuvanja
    await user.save();
    console.log("User object after saving:", user); // Posle čuvanja

    process.stdout.write("User saved to database with role 'user'\n");
    res
      .status(201)
      .send({ message: `User registered successfully!!! ${user}` });
  } catch (err) {
    process.stdout.write(`Error during registration: ${err.message}\n`);
    res.status(400).send({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.send({ token });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Ruta za dobavljanje podataka o korisniku (/api/auth/me):
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Ruta za promenu šifre (/api/auth/change-password):
router.post("/change-password", auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
