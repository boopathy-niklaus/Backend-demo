const { signupUser, loginUser } = require("../services/authService");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Request from the body :", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    const user = await signupUser({
      name,
      email,
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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await loginUser({
      email,
      password
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
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






module.exports = {
  signup,

  login
};