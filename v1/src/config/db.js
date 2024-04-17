import typeorm, {DataSource} from "typeorm";
import User from "../models/User.js";
import Book from "../models/Book.js";
import { root } from "../constants/path.js";
import BorrowingHistorySchema from "../models/History.js";

const dataSource = new DataSource({
  type: "sqlite",
  database: `${root}/data/badreads.sqlite`,
  synchronize: true,
  entities: [User, Book, BorrowingHistorySchema],
});

export default dataSource;