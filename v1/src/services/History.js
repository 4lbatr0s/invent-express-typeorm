import dataSource from "../config/db.js";
import BaseService from "./BaseService.js";
import HistoryModel from "../models/History.js";
class HistoryService extends BaseService {
  constructor() {
    super(dataSource.getRepository(HistoryModel));
  }
  async createHistory(userId, bookId) {
      const borrowingHistory = {
        userId, 
        bookId
      }
      await this.add(borrowingHistory);
  }

  async updateBookReturnedStatus(bookId, returned) {
    try {
      const updatedBook = await this.update({id:bookId}, {returned:returned});
      return updatedBook;
    } catch (error) {
      throw new Error("Error updating book returned status: " + error.message);
    }
  }

  async returnBook(borrowingHistoryId) {
    const currentDate = new Date();
    await this.update({ id: borrowingHistoryId }, { returnedAt: currentDate });
  }

  async getBorrowingHistory(userId, bookId) {
    const bookHistory = await this.repository.findOne({
      where: { userId:userId, bookId:bookId, returnedAt: null },
    });
    return bookHistory;
  }

  async getUserBorrowingHistoryOfUser(userId) {
    const currentDate = new Date();
  
    const borrowingHistory = await this.findAll({
      where: { userId },
      relations: ['book'], // Include the related book data
      order: { borrowedAt: "DESC" },
    });
  
    const previouslyBorrowedBooks = borrowingHistory.filter(
      (history) => history.returnedAt && history.returnedAt < currentDate
    ).map(({ book, returnedAt, borrowedAt }) => ({
      bookName: book.name,
      borrowedAt,
      returnedAt,
      bookId: book.id
    }));
  
    const currentlyBorrowedBooks = borrowingHistory.filter(
      (history) => !history.returnedAt
    ).map(({ book, borrowedAt}) => ({
      bookName: book.name,
      borrowedAt,
      bookId:book.id
    }));
  
    return {
      previouslyBorrowedBooks,
      currentlyBorrowedBooks,
    };
  }
}

export default new HistoryService();
