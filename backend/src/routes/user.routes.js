import express from "express";
import {
  create,
  defaultPhoto,
  list,
  photo,
  read,
  remove,
  update,
  userByID,
} from "../controllers/user.controller";
import { hasAuthorization, requireLogin } from "../controllers/auth.controller";
const router = express.Router();
router.route("/").get(list).post(create);

router
  .route("/:userId")
  .get(requireLogin, read)
  .put(requireLogin, hasAuthorization, update)
  .delete(requireLogin, hasAuthorization, remove);
router.route("/:userId/photo").get(photo, defaultPhoto);
router.route("/photos/defaultphoto").get(defaultPhoto);

router.param("userId", userByID);
export default router;
