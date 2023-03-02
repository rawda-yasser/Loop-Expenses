import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import config from "../config";
export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user || !user.authenticate(req.body.password)) {
      return res.status(401).send({ error: "Email and password don't match" });
    }
    const token = jwt.sign({ _id: user._id }, config.jwtSecret);

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
      },
    });
  } catch (err) {
    return res.status(401).json({ error: "couldn't login" });
  }
};
export const logout = (req, res) => {
  return res.status(200).json({
    message: "You're logged out",
  });
};
export const requireLogin = expressjwt({
  secret: config.jwtSecret,
  userProperty: "auth",
  algorithms: ["HS256"],
});
export const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized, please provide credentials",
    });
  }
  next();
};
