import axios from "axios";

export const generateAIPlan = async (userId, goal) => {
  const res = await axios.post(
    "http://localhost:5000/api/ai/generate",
    {
      userId,
      goal
    }
  );

  return res.data;
};
