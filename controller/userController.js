const { userModel } = require("../models/userModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sayHello = async(req, res) => {
  const response = {
    status: 200,
    success: false,
    message :"OK"  
  }
  const token = req.headers.authorization;
  console.log({token});
  if(!token){
    response.status = 400;
    response.success = false;
    response.message = "Token missing";
  }else{
    const verification = await jwt.verify(token.split("Bearer ")[1], process.env.JWT_SECRET, (err, data) => {
      if(err){
        response.success = false;
        response.message = err.toString();
        response.error = err.toString();
      }else{
        response.success = true;
        response.message = `Hello ${req.body.firstName} ${req.body.lastName}`;
        return data;
      }
    });
    response.data = verification;
  }
  return res.status(response.status).json(response);
}

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validator.isLength(password, { min: 6,max:30 })) {
      return res.status(400).json({ message: "Password must be at least 6 characters long and less than 30 characters long" });
    }

    const existingUser = await userModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await userModel.create({ firstName, lastName, email, password });

    let token;
    try {
      token = newUser.getJWT();
    } catch (error) {
      newUser.destroy();
      return res.status(500).json({ message: "JWT_SECRET is missing or invalid" });
    }

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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password credentials" });
    }

    const token = user.getJWT();

    req.session.user = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token
    };
    console.log(req.session);

    res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 8 * 3600000) });

    const userDetails = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt
    };

    res.status(200).json({ message: "Login successful", user: req.session.user, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
  });
};

const createUser = async (req, res) => {
  try {
      const { firstName, lastName, email, password} = req.body;

      if (!firstName || !lastName || !email || !password) {
          return res.status(400).json({ message: "All fields are required" });
      }

      if (!validator.isEmail(email)) {
          return res.status(400).json({ message: "Invalid email format" });
      }

      if (!validator.isLength(password, { min: 6 })) {
          return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      const newUser = await userModel.create({ firstName, lastName, email, password});
      res.status(201).json({ message: "User created successfully", user: newUser });

  } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {

      let { page, size } = req.query;

      page = parseInt(page) || 1;
      const limit = parseInt(size) || 6;

      const offset = (page - 1) * limit; 

      const { count, rows: users } = await userModel.findAndCountAll({
          attributes: ["id", "firstName", "lastName", "email", "createdAt", "updatedAt"],
          offset,
          limit,
          order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
          data: users,
          totalUsers: count,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
      });
  } catch (err) {
    console.error(err);
      res.status(500).json({ message: "Error fetching users", error: err.message });
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

const updateUser = async(req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
    
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

module.exports = {sayHello,signup, login, logout, getUsers, createUser, getUserById, deleteUser, updateUser};