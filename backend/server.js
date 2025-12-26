require("dotenv").config();

const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const healthRoutes = require("./routes/healthRecordRoutes");
const aiRoutes = require("./routes/aiRoutes");
const imageRoutes = require("./routes/imageRoutes"); 
const foodPlanRoutes = require("./routes/foodPlanRoutes");
const trainingPlanRoutes = require("./routes/trainingPlanRoutes");


const app = express();
console.log("DB_USER:", process.env.DB_USER);

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

//routes
app.use("/api/users", userRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/images", imageRoutes); 
app.use("/api/food-plan", foodPlanRoutes);
app.use("/api/training-plan", trainingPlanRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
