const { userModel } = require("../models/userModel");
const validator = require("validator");
const bcrypt = require("bcrypt");

// Signup
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate inputs
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validator.isLength(password, { min: 6 })) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const newUser = await userModel.create({ firstName, lastName, email, password });

    // Generate JWT token
    let token;
    try {
      token = newUser.getJWT();
    } catch (error) {
      newUser.destroy();
      return res.status(500).json({ message: "JWT_SECRET is missing or invalid" });
    }

    // Set JWT in cookie
    res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 8 * 3600000) });

    const userDetails = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      updatedAt: newUser.updatedAt,
      createdAt: newUser.createdAt
    };

    res.status(201).json({ message: "User created successfully", user: userDetails });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message });
  }
};


// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email credentials" });
    }

    // Validate password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password credentials" });
    }

    // Generate JWT token
    const token = user.getJWT();

    // Set JWT in cookie
    res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 8 * 3600000) });

    const userDetails = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt
    };

    res.status(200).json({ message: "Login successful", user: userDetails, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Logout
const logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
};

// Create a new user
const createUser = async (req, res) => {
  try {
      const { firstName, lastName, email, password} = req.body;

      // Validation checks
      if (!firstName || !lastName || !email || !password) {
          return res.status(400).json({ message: "All fields are required" });
      }

      if (!validator.isEmail(email)) {
          return res.status(400).json({ message: "Invalid email format" });
      }

      if (!validator.isLength(password, { min: 6 })) {
          return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

    //   if (!["male", "female", "other"].includes(gender.toLowerCase())) {
    //       return res.status(400).json({ message: "Gender must be Male, Female, or Other" });
    //   }

    //   if (isNaN(age) || age < 18 || age > 100) {
    //       return res.status(400).json({ message: "Age must be a number between 18 and 100" });
    //   }

      const newUser = await userModel.create({ firstName, lastName, email, password});
      res.status(201).json({ message: "User created successfully", user: newUser });

  } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: error.message });
  }
};


const getUsers = async (req, res) => {
    try {
        const users = await userModel.findAll({
          attributes: ["id", "firstName", "lastName", "email", "createdAt", "updatedAt"]
        });
        res.status(200).json({ data: users });
    } catch (err) {
        res.status(500).json({message: "Error fetching users", error: err.message});
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userModel.findByPk(req.params.id, {
          attributes: ["id", "firstName", "lastName", "email", "createdAt", "updatedAt"]
        }) ;
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({data: user });
    } catch (err) {
        res.status(500).json({message: "Error fetching user", error: err.message});
    }
};

const deleteUser = async (req, res) => {
    try {
        // console.log(req.params.id);
        const user = await userModel.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const userDeleted = await user.destroy();
        res.status(200).json({message: "User deleted successfully!"});
    } catch (err) {
        res.status(500).json({message: "Some Error occured while deleting the user", error: err.message});
    }
};

// update user by Id
const updateUser = async(req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
    
        // Validate input
        if (!firstName || !lastName || !email) {
          return res.status(400).json({ message: "First name, last name, and email are required" });
        }
        if (!validator.isEmail(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
    
        const user = await userModel.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
    
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        if (password) {
          if (!validator.isLength(password, { min: 6 })) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
          }
          user.password = password;
        }
    
        await user.save();
        res.status(200).json({ message: "User updated successfully", user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
      }
};

module.exports = { signup, login, logout, getUsers, createUser, getUserById, deleteUser, updateUser };