import { EntitySchema } from "typeorm";

const UserSchema = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
      default: () => "uuid_generate_v4()",
    },
    full_name: { type: "varchar" },
    password: { type: "varchar" },
    email: { type: "varchar", unique: true },
    profile_image: { type: "varchar", nullable: true },
  },
  relations: {
    books: {
      target: "Book",
      type: "one-to-many",
      mappedBy: "user",
    },
    borrowingHistory: {
      target: "BorrowingHistory",
      type: "one-to-many",
      mappedBy: "user",
    },
  },
});

export default UserSchema;