const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")

const generateToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("Password before hashing:", password);
console.log("Password after hashing:", hashedPassword);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, username, email, photo, password, phone, bio } = user;
    res.status(201).json({
      _id,
      username,
      email,
      password,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("Login Inputs:", { email, password });

  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }

  // Check if user exists
  const user = await User.findOne({ email });
  console.log("User Found:", user);

  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up");
  }

  // Compare passwords
  const passwordIsCorrect = await bcrypt.compareSync(password, user.password);
  console.log("Password Comparison:", passwordIsCorrect);

  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = generateToken(user._id);
  console.log("Generated Token:", token);

  // Set cookie if password matches
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  // Send response
  const { _id, username, photo, phone, bio } = user;
  res.status(200).json({
    _id,
    username,
    email,
    photo,
    phone,
    bio,
    token,
  });
});


// Logout User
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
});

// Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, username, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      username,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

// Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { username, email, photo, phone, bio } = user;
    user.email = email;
    user.username = req.body.username || username;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up");
  }

  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please add old and new password");
  }

//   const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);
  const passwordIsCorrect = oldPassword != user.password ? false : true;;

  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password change successful");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});

const forgotPassword = asyncHandler(async(req,res)=>{
    const {email} = req.body;
    const user = await User.findOne({email});
    console.log(user)
    if(!user){
      res.status(404);
      throw new Error("User Does not exist");
    }
    //Delete token if it exists in DB

    let token = await Token.findOne({userId: user._id});
    console.log("token",token)
    if(token){
      await token.deleteOne();
    }

    //reset token
    let resetToken=crypto.randomBytes(32).toString("hex")+user._id;
    console.log("reser token",resetToken);
    // res.send("forgot password")

    //hashed token
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    

    //save Token to DB
    await new Token({
      userId : user._id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * (60 * 1000), // Thirty minutes
    }).save()

    //reset url construction
    const resetUrl =`${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    console.log(resetUrl)
    //reset email

    const message = `
    <h2>Hello ${user.username}</h2>
    <p>Please use the url below to reset your password</p>
    <p>This reset link is valid for only 30 mins.</p>

    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

    <p>Regards...</p>
    <p>Mohit Kumar</p>
    `;
  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try{
    await sendEmail(subject,message,send_to, sent_from);
    res.status(200).json({
      success: true, message:"Reset Email Sent"
    });
  }
  catch(error){
    res.status(500);
    throw new error("Email not sent, please try again"); 
  }
});


//Reset password
const resetpassword = asyncHandler(async(req,res)=>{
  const {password} = req.body;
  const {resetToken} = req.params;

  //hash token, then compare to token in Db

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");


    //find token in Db

    const userToken = await Token.findOne({
      token: hashedToken,
      expiresAt: {
        $gt : Date.now()
      }
    });

    if(!userToken){
      res.status(404);
      throw new Error('Invalid or Expired Link');
    }

    //find user
    const user = await User.findOne({_id: userToken.userId});
    user.password = password;
    await user.save();

    res.status(200).json({
      message:"Password Reset Successfull,Please Login"
    })
})
module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetpassword,
};
