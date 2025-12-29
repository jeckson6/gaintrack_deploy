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
// LOGIN (AUTHENTICATE VIA USERS)
// =========================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    // 1️⃣ Get active user by email
    const [[user]] = await db.promise().query(
      `
      SELECT 
        UserID,
        Email,
        PasswordHash,
        IsActive
      FROM Users
      WHERE Email = ?
      `,
      [email]
    );

    // 2️⃣ User not found
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Check account active
    if (!user.IsActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    // 4️⃣ Password check
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 5️⃣ Update last login time
    await db.promise().query(
      "UPDATE Users SET LastLoginAt = NOW() WHERE UserID = ?",
      [user.UserID]
    );

    // 6️⃣ Detect role
    let role = "user";

    const [[admin]] = await db.promise().query(
      "SELECT AdminID FROM Admins WHERE UserID = ?",
      [user.UserID]
    );

    if (admin) role = "admin";

    // 7️⃣ Response
    res.json({
      message: "Login successful",
      user: {
        UserID: user.UserID,
        Email: user.Email,
        role
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
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
    u.UserID,
    u.Email,
    u.IsActive,
    u.LastLoginAt,
    up.FirstName,
    up.LastName,
    up.Gender,
    up.Contact,
    DATE_FORMAT(up.DateOfBirth, '%Y-%m-%d') AS DateOfBirth,
    CASE
      WHEN a.AdminID IS NOT NULL THEN 'Admin'
      ELSE 'User'
    END AS Role
  FROM Users u
  LEFT JOIN UserProfiles up ON up.UserID = u.UserID
  LEFT JOIN Admins a ON a.UserID = u.UserID
  WHERE u.UserID = ?
  `,
      [userId]
    );
    res.json(profile || null);
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
        FirstName: firstName || "",
        LastName: lastName || "",
        Contact: contact || "",
        Gender: gender || "",
        DateOfBirth: dateOfBirth || ""
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

    // 1️⃣ Get user
    const [[user]] = await db.promise().query(
      "SELECT PasswordHash FROM Users WHERE UserID = ?",
      [userId]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password incorrect" });
    }

    // 3️⃣ Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // 4️⃣ Update DB
    await db.promise().query(
      "UPDATE Users SET PasswordHash = ? WHERE UserID = ?",
      [newHash, userId]
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ message: "Password update failed" });
  }
};
exports.getAllUsersWithRole = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT
        u.UserID,
        u.Email,
        u.IsActive,
        u.RegisteredAt,
        u.LastLoginAt,
        CASE
          WHEN a.AdminID IS NOT NULL THEN 'Admin'
          ELSE 'User'
        END AS Role
      FROM Users u
      LEFT JOIN Admins a ON a.UserID = u.UserID
      ORDER BY u.UserID ASC
    `);

    res.json(rows);
  } catch (err) {
    console.error("GET ALL USERS ERROR:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
};
