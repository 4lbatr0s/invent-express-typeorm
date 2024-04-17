import express from 'express';
import schemas from "../validations/Users.js";
import validate from "../middlewares/validate.js";
import UsersController from "../controllers/Users.js";
import authenticate from "../middlewares/authenticate.js";
import idChecker from '../middlewares/idChecker.js';

const router = express.Router();

router.route("/").post(validate(schemas.createValidation), UsersController.create);
router.get("/", authenticate, UsersController.list);
router.route("/:id").get(authenticate, idChecker(), UsersController.getUserById);
router.route("/login").post(validate(schemas.loginValidation), UsersController.login);
router.route("/").patch(authenticate, validate(schemas.updateValidation), UsersController.update);
router.route("/reset-password").post(validate(schemas.resetPasswordValidation), UsersController.resetPassword);
router.route("/change-password").post(authenticate, validate(schemas.changePasswordValidation), UsersController.changePassword);
router.route("/:id").delete(authenticate, idChecker(), UsersController.remove);
router.route("/update-profile-image").post(authenticate, UsersController.updateProfileImage);
router
  .route("/:userId/borrow/:bookId")
  .post(authenticate, UsersController.borrowBook);

router
  .route("/:userId/return/:bookId")
  .post(authenticate, validate(schemas.ratingValidation), UsersController.returnBook);

export default router;