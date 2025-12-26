const db = require("../config/db");
const bcrypt = require("bcryptjs");

// =========================
// REGISTER
// =========================
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️⃣ Create user
    const [result] = await db.promise().query(
      `INSERT INTO Users (Email, PasswordHash, IsActive)
       VALUES (?, ?, 1)`,
      [email, hashedPassword]
    );

    const userId = result.insertId;

    // 2️⃣ Auto create empty profile
    await db.promise().query(
      `INSERT INTO UserProfiles (UserID) VALUES (?)`,
      [userId]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// =========================
// LOGIN
// =========================
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

// =========================
// GET PROFILE
// =========================
exports.getProfile = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const [[profile]] = await db.promise().query(
      `
      SELECT 
        UserID,
        FirstName,
        LastName,
        Contact,
        Gender,
       DATE_FORMAT(DateOfBirth, '%Y-%m-%d') AS DateOfBirth,
        ProfileImageURL
      FROM UserProfiles
      WHERE UserID = ?
      `,
      [userId]
    );

    if (!profile) {
      return res.json(null);
    }

    res.json(profile);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

// =========================
// UPDATE PROFILE
// =========================
exports.updateProfileSettings = async (req, res) => {
  try {
    const {
      userId,
      firstName,
      lastName,
      contact,
      gender,
      dateOfBirth
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "UserID is required" });
    }

    const [[profile]] = await db.promise().query(
      "SELECT ProfileID FROM UserProfiles WHERE UserID = ?",
      [userId]
    );

    // If profile does NOT exist → INSERT
    if (!profile) {
      await db.promise().query(
        `
        INSERT INTO UserProfiles
        (UserID, FirstName, LastName, Contact, Gender, DateOfBirth, ProfileImageURL)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          userId,
          firstName || null,
          lastName || null,
          contact || null,
          gender || null,
          dateOfBirth || null,
          gender === "Female"
            ? "/assets/female.png"
            : gender === "Male"
              ? "/assets/male.png"
              : "/assets/other.png"
        ]
      );
    }
    // Else → UPDATE
    else {
      await db.promise().query(
        `
        UPDATE UserProfiles
        SET 
          FirstName = ?,
          LastName = ?,
          Contact = ?,
          Gender = ?,
          DateOfBirth = ?
        WHERE UserID = ?
        `,
        [
          firstName || null,
          lastName || null,
          contact || null,
          gender || null,
          dateOfBirth || null,
          userId
        ]
      );
    }

    res.json({
      message: "Profile updated successfully",
      profile: {
        UserID: userId,
        FirstName: firstName,
        LastName: lastName,
        Contact: contact,
        Gender: gender,
        DateOfBirth: dateOfBirth
      }
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};
// =========================
// CHANGE PASSWORD
// =========================
exports.changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 1️⃣ Get current password hash
    const [[user]] = await db.promise().query(
      "SELECT PasswordHash FROM Users WHERE UserID = ?",
      [userId]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Verify current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.PasswordHash
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Current password incorrect" });
    }

    // 3️⃣ Hash new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // 4️⃣ Update password
    await db.promise().query(
      "UPDATE Users SET PasswordHash = ? WHERE UserID = ?",
      [newHashedPassword, userId]
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ message: "Password update failed" });
  }
};