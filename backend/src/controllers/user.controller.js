import User from "../models/user.model";
import extend from "lodash/extend";
import errorHandler from "../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";

export const create = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).send({ error: "Email already exists" });
    user = new User(req.body);
    await user.save();
    return res.status(200).json({ message: "Successfully signed up" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
export const list = async (req, res) => {
  try {
    const users = await User.find().select("name updated created");
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
export const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id).exec();
    if (!user)
      return res.status(400).json({
        error: "User not found",
      });
    user.hashedPassword = undefined;
    user.salt = undefined;
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user",
    });
  }
};
export const read = (req, res) => {
  req.profile.hashedPassword = undefined;
  req.profile.salt = undefined;
  req.profile.email = undefined;
  return res.json(req.profile);
};
export const update = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    let user = req.profile;
    user = extend(user, fields);

    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.filepath);
      user.photo.contentType = files.photo.type;
    }
    try {
      await user.save();

      user.hashedPassword = undefined;
      user.salt = undefined;
      user.updated = Date.now();
      return res.json(user);
    } catch (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error),
      });
    }
  });
};
export const remove = async (req, res) => {
  try {
    const user = req.profile;
    // console.log("REQ PROFILE", req.profile);
    const deletedUser = await User.findByIdAndDelete(user._id);
    deletedUser.hashedPassword = undefined;
    deletedUser.salt = undefined;
    return res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
export const photo = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }describe("put /api/expenses/:expenseId", () => {
    test("update an expense for user1 should succeed", async () => {
      const response = await request(server)
        .put(`/api/expenses/${expense1._id}`)
        .set("authorization", authHeader)
        .send({ title: "Restaurant updated" })
        .expect(200)
        .expect("Content-Type", /json/);
      expect(response.body.title).toEqual("Restaurant updated");
      expect(response.body.category).toEqual(expense1.category);
    });
    test("put an expense for user1 with no authorization", async () => {
      const response = await request(server)
        .put(`/api/expenses/${expense1._id}`)
        .send({ title: "Restaurant updated" })
        .expect(401);
      expect(response.body.title).toEqual(undefined);
    });
  });
  
  next();
};

export const defaultPhoto = (req, res) => {
  return res.sendFile("profile-pic.png", { root: "public" });
};
