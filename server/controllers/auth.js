import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      birth,
      country,
      church,
      phone,
    } = req.body;
    //validation
    if (!firstName) {
      return res.status(400).send("first name is required");
    }
    if (!lastName) {
      return res.status(400).send("last name is required");
    }
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("password is required and should be min 6 charcters");
    }
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("email is taken");

    //hash password
    const hashedPassword = await hashPassword(password);

    //register
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      birth,
      country,
      church,
      phone,
    });
    await user.save();
    console.log("saved user ", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.", err);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No user Found ");
    const match = await comparePassword(password, user.password);
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};
