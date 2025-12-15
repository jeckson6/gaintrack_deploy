const db = require("../config/db");
const bcrypt = require("bcryptjs");

// ✅ LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const sql = "SELECT UserID, Email, PasswordHash FROM Users WHERE Email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.PasswordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        UserID: user.UserID,
        Email: user.Email
      }
    });
  });
};

// ✅ PROFILE
exports.getProfile = (req, res) => {
  const userId = req.query.userId;

  const sql = "SELECT UserID, Email FROM Users WHERE UserID = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json(results[0]);
  });
};
