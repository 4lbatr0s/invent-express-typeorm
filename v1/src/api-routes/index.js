import UserRoutes from "./Users.js";
import BookRoutes from "./Books.js"
export default function loadRoutes(app) {
  app.use("/users", UserRoutes);
  app.use("/books", BookRoutes);
}

