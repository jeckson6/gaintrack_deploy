const OpenAI = require("openai");
const { buildAIPrompt } = require("../services/aiPrompt");
const db = require("../config/db");
const { getFoodImage } = require("../services/unsplashService");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

// 🔧 helper: attach images permanently
async function attachImagesToMealPlan(weeklyMeals) {
  for (const day of Object.keys(weeklyMeals)) {
    for (const meal of weeklyMeals[day]) {
      if (!Array.isArray(meal.foods)) continue;

      for (const food of meal.foods) {
        // ✅ if image is NOT a URL, replace it
        if (!food.image || !food.image.startsWith("http")) {
          food.image = await getFoodImage(food.item);
        }
      }
    }
  }
  return weeklyMeals;
}

// ================================
// POST analyze health + generate AI
// ================================
exports.analyzeHealth = async (req, res) => {
  try {
    const { userId, goal, trainingStyle, trainingDays } = req.body;

    // 1️⃣ Load user profile
    const [[profile]] = await db.promise().query(
      "SELECT Gender FROM UserProfiles WHERE UserID = ?",
      [userId]
    );

    // 2️⃣ Load latest health record
    const [[record]] = await db.promise().query(
      `
      SELECT Height_cm, Weight_kg, BMI, BodyFatPercentage
      FROM HealthRecords
      WHERE UserID = ?
      ORDER BY RecordedDate DESC
      LIMIT 1
      `,
      [userId]
    );

    if (!profile || !record) {
      return res.status(400).json({ message: "Health data incomplete" });
    }

    // 3️⃣ Build AI prompt
    const prompt = buildAIPrompt({
      gender: profile.Gender,
      height: record.Height_cm,
      weight: record.Weight_kg,
      bmi: record.BMI,
      bodyFat: record.BodyFatPercentage,
      goal,
      trainingStyle,
      trainingDays
    });

    // 4️⃣ Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4
    });

    const aiResult = JSON.parse(
      response.choices[0].message.content
    );

    if (
      Array.isArray(aiResult.trainingPlan) &&
      typeof trainingDays === "number"
    ) {
      aiResult.trainingPlan = aiResult.trainingPlan.slice(0, trainingDays);
    }

    // 5️⃣ Attach images (ONCE, permanent)
    const weeklyMealsWithImages = await attachImagesToMealPlan(
      aiResult.weeklyMeals
    );

    // 6️⃣ Save to AIFoodPlanDB
    await db.promise().query(
      `
      INSERT INTO AIFoodPlan
      (UserID, DailyCalories, Protein_g, Carbs_g, Fats_g, MealPlan, CreatedAt)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        userId,
        aiResult.dailyCalories,
        aiResult.macros.protein,
        aiResult.macros.carbs,
        aiResult.macros.fats,
        JSON.stringify(weeklyMealsWithImages)
      ]
    );

    // 6️⃣ Save to AItrainingplanDB
    await db.promise().query(
      `
  INSERT INTO AITrainingPlan
  (UserID, PlanType, TrainingMethod, WeeklySchedule, CreatedAt)
  VALUES (?, ?, ?, ?, NOW())
  `,
      [
        userId,
        goal,                     // Bulking / Cutting / Maintenance
        trainingStyle,            // ppl / upper_lower / full_body
        JSON.stringify(aiResult.trainingPlan)
      ]
    );


    // 7️⃣ Return enriched result
    res.json({
      dailyCalories: aiResult.dailyCalories,
      macros: aiResult.macros,
      weeklyMeals: weeklyMealsWithImages,
      trainingPlan: aiResult.trainingPlan
    });

    console.log("TRAINING INPUT:", trainingStyle, trainingDays);


  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ message: "AI generation failed" });
  }
};

// ================================
// GET health summary for KPI cards
// ================================
exports.getHealthSummary = async (req, res) => {
  try {
    const { userId } = req.query;

    const [[profile]] = await db.promise().query(
      "SELECT Gender FROM UserProfiles WHERE UserID = ?",
      [userId]
    );

    const [[record]] = await db.promise().query(
      `
      SELECT Height_cm, Weight_kg, BMI, BodyFatPercentage
      FROM HealthRecords
      WHERE UserID = ?
      ORDER BY RecordedDate DESC
      LIMIT 1
      `,
      [userId]
    );

    if (!record) return res.json(null);

    res.json({
      gender: profile?.Gender || "Unknown",
      ...record
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load health summary" });
  }
};
