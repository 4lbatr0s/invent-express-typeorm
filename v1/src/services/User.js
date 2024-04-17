import dataSource from "../config/db.js";
import BaseService from "./BaseService.js";
import UserModel from "../models/User.js";
class UserService extends BaseService {
  constructor() {
    super(dataSource.getRepository(UserModel));
  }
  async loginUser(userEmail) {
    return await this.repository.findOne({ where: { email: userEmail } });
  }



  async returnBook(userId, bookId, rating) {
    const user = await this.repository.findOne(userId, {
      relations: ["books"],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const bookIndex = user.books.findIndex((book) => book.id === bookId);
    if (bookIndex === -1) {
      throw new Error("Book not found in user's collection");
    }
    // Remove the book from user's collection
    user.books.splice(bookIndex, 1);

    await this.repository.save(user);
  }
}

export default new UserService();
