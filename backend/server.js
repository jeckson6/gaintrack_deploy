require("dotenv").config();

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const healthRoutes = require("./routes/healthRecordRoutes");
const trainingPlanRoutes = require("./routes/trainingPlanRoutes");
const foodPlanRoutes = require("./routes/foodPlanRoutes");

const app = express();
console.log("DB_USER:", process.env.DB_USER);

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

//routes
app.use("/api/user", userRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/training-plan", trainingPlanRoutes);
app.use("/api/food-plan", foodPlanRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
