const bcrypt = require("bcrypt");
const User = require("../model/User.model");
const createToken = require("../utils/createToken");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, role, password, image } = req.body;

    if (role === "admin")
      return res
        .status(403)
        .send({ message: "Admin registration is not allowed" });

    const isExist = await User.findOne({ email });
    if (isExist)
      return res.status(409).send({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );

    const newUser = new User({
      name,
      email,
      role,
      password: hashedPassword,
      image,
    });
    await newUser.save();

    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Failed to register user" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).send({ message: "Invalid password" });

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = createToken(
      payload,
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_ACCESS_EXPIRES_IN
    );
    const refreshToken = createToken(
      payload,
      process.env.JWT_REFRESH_SECRET,
      process.env.JWT_REFRESH_EXPIRES_IN
    );

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .status(200)
      .send({ accessToken, name: user.name, image: user.image });
  } catch (err) {
    res.status(500).send({ message: "Login failed" });
  }
};

exports.logoutUser = (req, res) => {
  res
    .clearCookie("refreshToken", {
      maxAge: 0,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .status(200)
    .send({ message: "Logged out successfully" });
};

exports.refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).send({ message: "User not found" });

    const newToken = createToken(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_ACCESS_EXPIRES_IN
    );

    res.status(200).send({ accessToken: newToken });
  } catch (err) {
    res.status(500).send({ message: "Refresh token error" });
  }
};
