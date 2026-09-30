const { signupUser, loginUser, getUserById } = require("../services/authService");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Request from the body :", req.body);

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }


    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }


    const user = await signupUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    if (error.message === "Email already registered") {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    console.error("Signup error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    const { user, token } = await loginUser({
      email:email.trim().toLowerCase(),
      password
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    if (error.message === "Invalid email or password") {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};


const getMe = async (req, res) => {
  try {
    const user = await getUserById(req.userId);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    console.error("Get user error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};







module.exports = {
  signup,

  login,
  getMe
};