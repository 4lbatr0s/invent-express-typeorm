import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url); //get all name
const __dirname = path.dirname(__filename); //get dir name from it.

export const root = path.resolve(__dirname, "..");
