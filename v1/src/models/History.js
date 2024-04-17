import { EntitySchema } from "typeorm";

const BorrowingHistorySchema = new EntitySchema({
  name: "BorrowingHistory",
  tableName: "borrowing_history",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
      default: () => "uuid_generate_v4()",
    },
    userId: {
      type: "uuid",
    },
    bookId: {
      type: "uuid",
    },
    borrowedAt: {
      type: "datetime",
      default: () => "CURRENT_TIMESTAMP",
    },
    returnedAt: {
      type: "datetime",
      nullable: true,
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      inverseSide: "borrowingHistory",
      joinColumn: {
        name: "userId",
      },
    },
    book: {
      target: "Book",
      type: "many-to-one",
      joinColumn: {
        name: "bookId",
      },
    },
  },
});

export default BorrowingHistorySchema;