import { connectDB } from "./db.js";

export default async () => {
  await connectDB(); // Wait for the database connection to be established
};
