import dataSource from "../config/db.js";

const connectDB = () => {
  return dataSource.initialize()
    .then(() => {
      console.log("Database connection established");
    })
    .catch((error) => {
      console.log("Error: ", error);
      throw error; // Rethrow the error to propagate it to the caller
    });
};


export { connectDB };
