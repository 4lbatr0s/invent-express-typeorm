import express from "express";
import schemas from "../validations/Book.js";
import validate from "../middlewares/validate.js";
import BookController from "../controllers/Books.js";
import authenticate from "../middlewares/authenticate.js";
import idChecker from "../middlewares/idChecker.js";

const bookRouter = express.Router();

bookRouter
  .route("/")
  .post(validate(schemas.createValidation), BookController.create);
bookRouter.get("/", authenticate, BookController.list);
bookRouter.route("/:id").get(authenticate, idChecker(), BookController.find);
bookRouter
  .route("/:id")
  .patch(
    authenticate,
    idChecker(),
    validate(schemas.updateValidation),
    BookController.update
  );
bookRouter
  .route("/:id")
  .delete(idChecker(), authenticate, BookController.remove);

export default bookRouter;
