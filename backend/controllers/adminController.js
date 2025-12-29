// backend/controllers/adminController.js
const db = require("../config/db");
const logAction = require("../utils/logAction");
const bcrypt = require("bcryptjs");


// ======================
// ADMIN PROFILE
// ======================
exports.getAdminProfile = async (req, res) => {
  try {
    const { userId } = req.query;

    const [[admin]] = await db.promise().query(
      `
      SELECT 
        AdminID,
        UserID,
        FirstName,
        LastName,
        Gender,
        CreatedAt,
        LastLoginAt
      FROM Admins
      WHERE UserID = ?
      `,
      [userId]
    );

    res.json(admin || null);
  } catch (err) {
    console.error("ADMIN PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to load admin profile" });
  }
};

// ======================
// ADMIN DASHBOARD
// ======================
exports.getAdminDashboard = async (req, res) => {
  try {
    const [[kpi]] = await db.promise().query(`
      SELECT
        (SELECT COUNT(*) FROM Users) AS totalUsers,
        (SELECT COUNT(*) FROM Users WHERE IsActive = 1) AS activeUsers,
        (SELECT COUNT(*) FROM Users WHERE IsActive = 0) AS inactiveUsers,
        (SELECT COUNT(*) FROM AIFoodPlan) AS totalFoodPlans,
        (SELECT COUNT(*) FROM AITrainingPlan) AS totalTrainingPlans
    `);

    const [gender] = await db.promise().query(`
      SELECT Gender, COUNT(*) AS count
      FROM UserProfiles
      GROUP BY Gender
    `);

    const genderMap = { Male: 0, Female: 0, Other: 0 };
    gender.forEach(g => {
      if (genderMap[g.Gender] !== undefined) {
        genderMap[g.Gender] = g.count;
      }
    });

    res.json({
      ...kpi,
      maleCount: genderMap.Male,
      femaleCount: genderMap.Female,
      otherCount: genderMap.Other
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};


// ======================
// USER MANAGEMENT
// ======================
exports.adminGetUserProfile = async (req, res) => {
  try {
    const { userId } = req.query;

    const [[user]] = await db.promise().query(
      `
      SELECT
        u.UserID,
        u.Email,
        u.IsActive,
        u.LastLoginAt,
        p.FirstName,
        p.LastName,
        p.Gender,
        p.Contact,
        DATE_FORMAT(p.DateOfBirth, '%Y-%m-%d') AS DateOfBirth,
        CASE
          WHEN a.UserID IS NOT NULL THEN 'Admin'
          ELSE 'User'
        END AS Role
      FROM Users u
      LEFT JOIN UserProfiles p ON p.UserID = u.UserID
      LEFT JOIN Admins a ON a.UserID = u.UserID
      WHERE u.UserID = ?
      `,
      [userId]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("GET USER PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to load user profile" });
  }
};

exports.adminUpdateUserProfile = async (req, res) => {
  try {
    const {
      adminUserId,
      userId,
      firstName,
      lastName,
      contact,
      gender,
      dateOfBirth
    } = req.body;

    if (!adminUserId) {
      return res.status(400).json({ message: "Admin not identified" });
    }

    // Check if profile exists
    const [[profile]] = await db.promise().query(
      "SELECT ProfileID FROM UserProfiles WHERE UserID = ?",
      [userId]
    );

    if (!profile) {
      await db.promise().query(
        `
        INSERT INTO UserProfiles
        (UserID, FirstName, LastName, Contact, Gender, DateOfBirth)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          userId,
          firstName || null,
          lastName || null,
          contact || null,
          gender || null,
          dateOfBirth || null
        ]
      );
    } else {
      await db.promise().query(
        `
        UPDATE UserProfiles
        SET FirstName=?, LastName=?, Contact=?, Gender=?, DateOfBirth=?
        WHERE UserID=?
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

    // System log (admin action only)
    await logAction(
      adminUserId,
      "ADMIN_UPDATE_USER_PROFILE",
      `UserID ${userId}`
    );

    // ONE response only
    res.json({
      message: "User profile updated by admin",
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
    console.error("ADMIN UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Admin profile update failed" });
  }
};
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId, isActive, adminUserId } = req.body;

    await db.promise().query(
      `UPDATE Users SET IsActive = ? WHERE UserID = ?`,
      [isActive ? 1 : 0, userId]
    );

    await logAction(
      adminUserId,
      isActive ? "ACTIVATE_USER" : "DEACTIVATE_USER",
      `UserID ${userId}`
    );

    res.json({ message: "User status updated" });
  } catch (err) {
    console.error("TOGGLE USER ERROR:", err);
    res.status(500).json({ message: "Failed to update user status" });
  }
};

exports.adminCreateUser = async (req, res) => {
  try {
    const { adminUserId, email, password, makeAdmin } = req.body;

    if (!adminUserId || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.promise().query(
      `INSERT INTO Users (Email, PasswordHash, IsActive)
       VALUES (?, ?, 1)`,
      [email, hashedPassword]
    );

    const userId = result.insertId;

    await db.promise().query(
      `INSERT INTO UserProfiles (UserID) VALUES (?)`,
      [userId]
    );

    if (makeAdmin) {
      await db.promise().query(
        `INSERT INTO Admins (UserID) VALUES (?)`,
        [userId]
      );
    }

    await logAction(
      adminUserId,
      "CREATE_USER",
      `UserID ${userId}`
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({ message: "Failed to create user" });
  }
};

exports.adminDeleteUser = async (req, res) => {
  try {
    const { adminUserId } = req.body;
    const { userId } = req.params;

    if (Number(adminUserId) === Number(userId)) {
      return res.status(403).json({
        message: "Admin cannot delete own account"
      });
    }

    // 1️⃣ Remove admin role if exists
    await db.promise().query(
      "DELETE FROM Admins WHERE UserID = ?",
      [userId]
    );

    // 2️⃣ Remove profile
    await db.promise().query(
      "DELETE FROM UserProfiles WHERE UserID = ?",
      [userId]
    );

    // 3️⃣ Remove user
    await db.promise().query(
      "DELETE FROM Users WHERE UserID = ?",
      [userId]
    );

    await logAction(
      adminUserId,
      "DELETE_USER",
      `UserID ${userId}`
    );

    res.json({ message: "User deleted permanently" });

  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};


exports.registerAdmin = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      gender,
      adminUserId
    } = req.body;

    if (!email || !password || !adminUserId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1. Check email
    const [[exists]] = await db.promise().query(
      "SELECT UserID FROM Users WHERE Email = ?",
      [email]
    );

    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // 2. Create user
    const passwordHash = await bcrypt.hash(password, 10);

    const [userResult] = await db.promise().query(
      `INSERT INTO Users (Email, PasswordHash, IsActive)
       VALUES (?, ?, 1)`,
      [email, passwordHash]
    );

    const userId = userResult.insertId;

    // 3. Create profile
    await db.promise().query(
      `INSERT INTO UserProfiles (UserID) VALUES (?)`,
      [userId]
    );

    // 4. Generate AdminID
    const [[lastAdmin]] = await db.promise().query(
      `SELECT AdminID FROM Admins ORDER BY AdminID DESC LIMIT 1`
    );

    let next = 1;
    if (lastAdmin?.AdminID) {
      next = parseInt(lastAdmin.AdminID.replace("AD", ""), 10) + 1;
    }

    const adminId = `AD${String(next).padStart(2, "0")}`;

    // 5. Insert Admin
    await db.promise().query(
      `
  INSERT INTO Admins
  (AdminID, UserID, FirstName, LastName, Gender, CreatedAt)
  VALUES (?, ?, ?, ?, ?, ?, NOW())
  `,
      [
        adminId,
        userId,
        firstName || "System",
        lastName || "Admin",
        gender || "Other",
      ]
    );

    await logAction(
      adminUserId,
      "CREATE_ADMIN",
      `AdminID ${adminId}`
    );

    res.status(201).json({
      message: "Admin registered successfully",
      adminId,
      userId
    });

  } catch (err) {
    console.error("REGISTER ADMIN ERROR:", err);
    res.status(500).json({ message: "Admin registration failed" });
  }
};

exports.removeAdmin = async (req, res) => {
  try {
    const { userId, adminUserId } = req.body;

    // Prevent self-demotion
    if (Number(userId) === Number(adminUserId)) {
      return res.status(403).json({
        message: "Admin cannot remove own admin role"
      });
    }

    // Check target is admin
    const [[target]] = await db.promise().query(
      "SELECT AdminID FROM Admins WHERE UserID = ?",
      [userId]
    );

    if (!target) {
      return res.status(404).json({
        message: "Target user is not an admin"
      });
    }

    // Ensure at least one admin remains
    const [[count]] = await db.promise().query(
      "SELECT COUNT(*) AS total FROM Admins"
    );

    if (count.total <= 1) {
      return res.status(403).json({
        message: "Cannot remove the last admin"
      });
    }

    // Remove admin role (user remains active)
    await db.promise().query(
      "DELETE FROM Admins WHERE UserID = ?",
      [userId]
    );

    // System log
    await logAction(
      adminUserId,
      "REMOVE_ADMIN",
      `UserID ${userId}`
    );

    res.json({
      message: "Admin role removed successfully"
    });

  } catch (err) {
    console.error("REMOVE ADMIN ERROR:", err);
    res.status(500).json({
      message: "Failed to remove admin"
    });
  }
};





// ======================
// AI USAGE MONITOR
// ======================
exports.getAIUsage = async (req, res) => {
  try {
    const [[foodPlans]] = await db.promise().query(`
      SELECT COUNT(*) AS used
      FROM AIFoodPlan
      WHERE DATE(CreatedAt) = CURDATE()
    `);

    const [[openai]] = await db.promise().query(`
      SELECT COUNT(*) AS today
      FROM AITrainingPlan
      WHERE DATE(CreatedAt) = CURDATE()
    `);

    res.json({
      unsplash: {
        used: foodPlans.used,
        limit: 50
      },
      openai: {
        today: openai.today
      }
    });
  } catch (err) {
    res.status(500).json({ message: "AI usage error" });
  }
};


// ======================
// TRAINING ANALYTICS
// ======================
exports.getTrainingAnalytics = async (req, res) => {
  try {
    const [data] = await db.promise().query(`
      SELECT TrainingMethod, COUNT(*) AS count
      FROM AITrainingPlan
      GROUP BY TrainingMethod
      ORDER BY count DESC
    `);

    res.json(data);
  } catch (err) {
    console.error("TRAINING ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Failed to load training analytics" });
  }
};

// ======================
// SYSTEM ANALYTICS
// ======================
exports.getSystemAnalytics = async (req, res) => {
  try {
    const [[stats]] = await db.promise().query(`
      SELECT
        (SELECT COUNT(*) FROM Users) AS totalUsers,
        (SELECT COUNT(*) FROM Admins) AS totalAdmins,
        (SELECT COUNT(*) FROM AIFoodPlan) AS foodPlans,
        (SELECT COUNT(*) FROM AITrainingPlan) AS trainingPlans
    `);

    res.json(stats);
  } catch (err) {
    console.error("SYSTEM ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Failed to load system analytics" });
  }
};
exports.saveAnnouncement = async (req, res) => {
  try {
    const { announcement, expiresAt, adminUserId } = req.body;

    await db.promise().query(
      `
      INSERT INTO SystemConfig (ConfigKey, ConfigValue, ExpiresAt)
      VALUES ('announcement', ?, ?)
      ON DUPLICATE KEY UPDATE
        ConfigValue = VALUES(ConfigValue),
        ExpiresAt = VALUES(ExpiresAt)
      `,
      [announcement, expiresAt || null]
    );

    await logAction(
      adminUserId,
      "UPDATE_ANNOUNCEMENT",
      "System Announcement"
    );

    res.json({ message: "Announcement saved" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save announcement" });
  }
};



exports.getAnnouncement = async (req, res) => {
  const [[row]] = await db.promise().query(`
    SELECT ConfigValue, ExpiresAt
    FROM SystemConfig
    WHERE ConfigKey = 'announcement'
      AND (ExpiresAt IS NULL OR ExpiresAt > NOW())
  `);

  res.json({
    announcement: row?.ConfigValue || "",
    expiresAt: row?.ExpiresAt || null
  });
};

exports.getSystemLogs = async (req, res) => {
  const [logs] = await db.promise().query(`
    SELECT
      l.LogID,
      l.Action,
      l.Target,
      l.CreatedAt,
      u.Email AS AdminEmail
    FROM SystemLogs l
    JOIN Users u ON u.UserID = l.AdminUserID
    ORDER BY l.CreatedAt DESC
    LIMIT 20
  `);

  res.json(logs);
};
