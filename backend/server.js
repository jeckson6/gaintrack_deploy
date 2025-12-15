require("dotenv").config();

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const app = express();
console.log("DB_USER:", process.env.DB_USER);

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

app.use("/api/user", userRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
