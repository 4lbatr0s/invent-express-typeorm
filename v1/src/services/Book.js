import dataSource from "../config/db.js";
import BaseService from "./BaseService.js";
import BookModel from "../models/Book.js";

class BookService extends BaseService {
  constructor() {
    super(dataSource.getRepository(BookModel));
  }

  async updateBookReturnedStatus(bookId, returned) {
    try {
      const updatedBook = await this.update({id:bookId}, {returned:returned});
      return updatedBook;
    } catch (error) {
      throw new Error("Error updating book returned status: " + error.message);
    }
  }

  async updateBookRating(bookId, score) {
    try {
      const book = await this.find(bookId);
      if (!book) {
        throw new Error("Book not found");
      }
      book.total_rating += score;
      book.num_rates += 1;
      book.average_rating = book.total_rating / book.num_rates;
      await this.repository.save(book);
      return book;
    } catch (error) {
      throw new Error("Error updating book rating: " + error.message);
    }
  }
}

export default new BookService();
