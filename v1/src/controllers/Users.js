import Helper from "../scripts/utils/helper.js";
import { ApiError, ApiNotFoundError } from "../errors/index.js";
import httpStatus from "http-status";
import UserService from "../services/User.js";
import BookService from "../services/Book.js"
import HistoryService from "../services/History.js";
import Messages from "../scripts/utils/messages.js";

class UsersController {
  async create(req, res, next) {
    req.body.password = Helper.passwordToHash(req.body.password);
    try {
      const result = await UserService.add(req.body);
      delete result.password; // Remove password from the response
      res.status(httpStatus.CREATED).send(result);
    } catch (error) {
      return next(new ApiError(error?.message, error?.statusCode));
    }
  }

  async list(req, res, next) {
    try {
      const users = await UserService.findAll();
      const response = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      return res.status(httpStatus.OK).send(response);

    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  }

  async getUserById(req, res, next) {
    const userId = req.params.id;
    try {
      const user = await UserService.find(userId, {
        relations: ["borrowingHistory", "borrowingHistory.book"],
      });
      if (!user) {
        return res.status(httpStatus.NOT_FOUND).send({ message: "User not found" });
      }
  
      const { password } = user;
      const { id, full_name, email, profile_image } = user;
      const borrowingHistory = await HistoryService.getUserBorrowingHistoryOfUser(userId);
      const {previouslyBorrowedBooks, currentlyBorrowedBooks} = borrowingHistory;
  
      const responseData = {
        id,
        full_name,
        email,
        profile_image,
        previouslyBorrowedBooks,
        currentlyBorrowedBooks,
      };
  
      return res.status(httpStatus.OK).send(responseData);
    } catch (error) {
      return next(new ApiError(error?.message, error?.statusCode));
    }
  }
  
  async login(req, res, next) {
    try {
      const user = await UserService.loginUser(req.body.email);
      if (!user) return next(new ApiNotFoundError());
      const hashedPassword = Helper.passwordToHash(req.body.password);
      if (hashedPassword.toString() !== user.password)
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ message: messages.ERROR.WRONG_CREDENTIAL });

      // Generate tokens
      const accessToken = Helper.createAccessToken(user);
      const refreshToken = Helper.createRefreshToken(user);

      user.tokens = { access_token: accessToken, refresh_token: refreshToken };

      delete user.password; // Do not return password

      return res.status(httpStatus.OK).send(user);
    } catch (error) {
      return next(new ApiError(error?.message, error?.statusCode));
    }
  }

  async projectList(req, res, next) {
    const userId = req.user?.id; // Assuming userId is in req.user.id
    try {
      const projects = await ProjectService.findAll({ user_id: userId });
      res.status(httpStatus.OK).send(projects);
    } catch (error) {
      return next(new ApiError(error?.message, error?.statusCode));
    }
  }

  async resetPassword(req, res, next) {
    try {
      const newPassword = Helper.createPassword();
      const updatedUser = await UserService.update(
        { email: req.body.email },
        { password: Helper.passwordToHash(newPassword) }
      );

      res.status(httpStatus.OK).send({
        message: "Password reset successful",
      });
    } catch (error) {
      return next(new ApiError(error?.message, error?.statusCode));
    }
  }

  async changePassword(req, res, next) {
    req.body.password = Helper.passwordToHash(req.body.password);
    try {
      const updatedUser = await UserService.update(
        { _id: req.user?.id },
        req.body
      );
      res.status(httpStatus.OK).send(updatedUser);
    } catch (error) {
      return next(new ApiError(error?.message, error?.statusCode));
    }
  }

  async update(req, res, next) {
    const updateData = Object.keys(req.body).reduce((objectToReturn, key) => {
      if (key !== "password") {
        objectToReturn[key] = req.body[key];
      }
      return objectToReturn;
    }, {});

    try {
      const updatedUser = await UserService.update(
        { _id: req.user?.id },
        updateData
      );
      res.status(httpStatus.OK).send(updatedUser);
    } catch (error) {
      return next(new ApiError(error?.message, error?.statusCode));
    }
  }

  async updateProfileImage(req, res, next) {
    const extensionName = path.extname(req.files.profile_image.name);
    const fileName = req.user?.id + `${extensionName}`;
    const folderPath = path.join(__dirname, "../", "uploads/users", fileName);

    if (!req?.files?.profile_image) {
      return next(
        new ApiError(
          "You should upload a profile image to update profile image.",
          httpStatus.BAD_REQUEST
        )
      );
    }

    req.files.profile_image.mv(folderPath, async function (error) {
      if (error) return next(new ApiError(error?.message, error?.statusCode));

      try {
        const updatedUser = await UserService.update(
          { _id: req.user._id },
          { profile_image: fileName }
        );
        return res
          .status(httpStatus.OK)
          .send({
            message: "Profil image updated successfully",
            user: updatedUser,
          });
      } catch (error) {
        return next(
          new ApiError(
            "An error occured while saving profile image to database"
          )
        );
      }
    });
  }

  async remove(req, res, next) {
    try {
      const deletedUser = await UserService.delete(req.params?.id);
      if (!deletedUser)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ error: Messages.ERROR.USER_NOT_FOUND });
      res
        .status(httpStatus.OK)
        .send({ message: "User deleted successfully" });
    } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "An error occured while deleting user." });
    }
  }

  async borrowBook(req, res, next) {
    const { userId, bookId } = req.params;
    try {
      // Check if the book is already borrowed by another user
      const book = await BookService.find(bookId);
      const user = await UserService.find(userId);
      if (!book || !user) {
        throw new Error("Book or user not found");
      }
      if (!book.returned) {
        throw new Error("Book is already borrowed by another user");
      }
      // Borrow the book
      await HistoryService.createHistory(userId, bookId);
      await BookService.updateBookReturnedStatus(bookId, false);
      res.status(httpStatus.OK).send({ message: "Book borrowed successfully" });
    } catch (error) {
      if (
        error.message === "Book or user not found" ||
        error.message === "Book is already borrowed by another user"
      ) {
        return next(new ApiError(error.message, httpStatus.BAD_REQUEST));
      }
      return next(
        new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
      );
    }
  }

  async returnBook(req, res, next) {
    const { userId, bookId } = req.params;
    const { score } = req.body;
  
    try {
      // Check if the book exists
      const book = await BookService.find(bookId);
      if (!book) {
        throw new Error("Book not found");
      }
  
      // Check if the user exists
      const user = await UserService.find(userId);
      if (!user) {
        throw new Error("User not found");
      }
  
      // Check if the book is currently borrowed by the user
      const borrowingHistory = await HistoryService.getBorrowingHistory(userId, bookId);
      const returnedAt = borrowingHistory.returnedAt;
      if (!borrowingHistory || returnedAt) {
        throw new Error("Book is not currently borrowed by the specified user");
      }
  
      // Update the book rating
      await BookService.updateBookRating(bookId, score);
      //update return status
      await BookService.updateBookReturnedStatus(bookId, true);
      // Update the borrowing history with the return date
      await HistoryService.returnBook(borrowingHistory.id);
  
      res.status(httpStatus.OK).send({ message: "Book returned and rated successfully" });
    } catch (error) {
      if (
        error.message === "Book not found" ||
        error.message === "User not found" ||
        error.message === "Book is not currently borrowed by the specified user"
      ) {
        return next(new ApiError(error.message, httpStatus.BAD_REQUEST));
      }
      return next(new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR));
    }
  }
}

export default new UsersController();
