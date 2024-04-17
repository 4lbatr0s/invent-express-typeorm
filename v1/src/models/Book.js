import { EntitySchema } from "typeorm";

const BookSchema = new EntitySchema({
  name: "Book",
  tableName: "books",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
      default: () => "uuid_generate_v4()",
    },
    name: {
      type: "varchar",
    },
    average_rating: {
      type: "int",
      default: 0,
    },
    total_rating: {
      type: "int",
      default: 0,
    },
    num_rates: { 
      type: "int",
      default: 0,
    },
    returned: {
      type: "boolean",
      default: true,
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      inverseSide: "books",
    },
  },
});

export default BookSchema;
