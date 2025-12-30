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
  admin_id,
  user_id,
  admin_first_name,
  admin_last_name,
  admin_gender,
  created_at
FROM admin
WHERE user_id = ?
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
        (SELECT COUNT(*) FROM user) AS totalUsers,
        (SELECT COUNT(*) FROM user WHERE is_active = 1) AS activeUsers,
        (SELECT COUNT(*) FROM user WHERE is_active = 0) AS inactiveUsers,
        (SELECT COUNT(*) FROM ai_food_plan) AS totalFoodPlans,
        (SELECT COUNT(*) FROM ai_training_plan) AS totalTrainingPlans
    `);

    const [genderRows] = await db.promise().query(`
      SELECT user_gender, COUNT(*) AS count
      FROM user_profile
      GROUP BY user_gender
    `);

    const genderMap = { Male: 0, Female: 0, Other: 0 };
    genderRows.forEach(row => {
      if (genderMap[row.user_gender] !== undefined) {
        genderMap[row.user_gender] = row.count;
      }
    });

    res.json({
      ...kpi,
      maleCount: genderMap.Male,
      femaleCount: genderMap.Female,
      otherCount: genderMap.Other
    });

  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Failed to load admin dashboard" });
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
        u.user_id,
        u.user_email,
        u.is_active,
        u.last_login_at,
        p.user_first_name,
        p.user_last_name,
        p.user_gender,
        p.user_contact,
        DATE_FORMAT(p.user_date_of_birth, '%Y-%m-%d') AS user_date_of_birth,
        CASE
          WHEN a.user_id IS NOT NULL THEN 'Admin'
          ELSE 'User'
        END AS role
      FROM user u
      LEFT JOIN user_profile p ON p.user_id = u.user_id
      LEFT JOIN admin a ON a.user_id = u.user_id
      WHERE u.user_id = ?
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
      "SELECT profile_id FROM user_profile WHERE user_id = ?",
      [userId]
    );

    if (!profile) {
      await db.promise().query(
        `
       INSERT INTO user_profile
        (user_id, user_first_name, user_last_name, user_contact, user_gender, user_date_of_birth)
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
       UPDATE user_profile
        SET
          user_first_name = ?,
          user_last_name = ?,
          user_contact = ?,
          user_gender = ?,
          user_date_of_birth = ?
        WHERE user_id = ?
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
      "UPDATE user SET is_active = ? WHERE user_id = ?",
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
      `      INSERT INTO user (user_email, password_hash, is_active)

       VALUES (?, ?, 1)`,
      [email, hashedPassword]
    );

    const userId = result.insertId;

    await db.promise().query(
      `INSERT INTO user_profile  (user_id) VALUES (?)`,
      [userId]
    );

    if (makeAdmin) {
      await db.promise().query(
        `INSERT INTO admin (user_id) VALUES (?)`,
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

    // 1️ Remove admin role if exists
    await db.promise().query(
      "DELETE FROM admin  WHERE user_id  = ?",
      [userId]
    );

    // 2️ Remove profile
    await db.promise().query(
      "DELETE FROM user_profile  WHERE user_id  = ?",
      [userId]
    );

    // 3️ Remove user
    await db.promise().query(
      "DELETE FROM user WHERE user_id  = ?",
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
      "SELECT user_id FROM user WHERE user_email  = ?",
      [email]
    );

    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // 2. Create user
    const passwordHash = await bcrypt.hash(password, 10);

    const [userResult] = await db.promise().query(
      ` INSERT INTO user (user_email, password_hash, is_active)
      VALUES (?, ?, 1)`,
      [email, passwordHash]
    );

    const userId = userResult.insertId;

    // 3. Create profile
    await db.promise().query(
      `INSERT INTO user_profile  (user_id) VALUES (?)`,
      [userId]
    );

    // 4. Generate AdminID
    const [[lastAdmin]] = await db.promise().query(
      `SELECT admin_id  FROM admin  ORDER BY admin_id DESC LIMIT 1`
    );

    let next = 1;
    if (lastAdmin?.AdminID) {
      next = parseInt(lastAdmin.AdminID.replace("AD", ""), 10) + 1;
    }

    const adminId = `AD${String(next).padStart(2, "0")}`;

    // 5. Insert Admin
    await db.promise().query(
      `
  INSERT INTO admin
      (admin_id, user_id, admin_first_name, admin_last_name, admin_gender, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
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
      "SELECT admin_id  FROM admin  WHERE UserID = ?",
      [userId]
    );

    if (!target) {
      return res.status(404).json({
        message: "Target user is not an admin"
      });
    }

    // Ensure at least one admin remains
    const [[count]] = await db.promise().query(
      "SELECT COUNT(*) AS total FROM admin"
    );

    if (count.total <= 1) {
      return res.status(403).json({
        message: "Cannot remove the last admin"
      });
    }

    // Remove admin role (user remains active)
    await db.promise().query(
      "DELETE FROM admin WHERE user_id  = ?",
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
      FROM ai_food_plan
      WHERE DATE(CreatedAt) = CURDATE()
    `);

    const [[openai]] = await db.promise().query(`
      SELECT COUNT(*) AS today
      FROM ai_training_plan
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
       SELECT training_method, COUNT(*) AS count
      FROM ai_training_plan
      GROUP BY training_method
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
      (SELECT COUNT(*) FROM user) AS totalUsers,
        (SELECT COUNT(*) FROM admin) AS totalAdmins,
        (SELECT COUNT(*) FROM ai_food_plan) AS foodPlans,
        (SELECT COUNT(*) FROM ai_training_plan) AS trainingPlans
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
     INSERT INTO systemconfig (config_key, config_value, expires_at)
      VALUES ('announcement', ?, ?)
      ON DUPLICATE KEY UPDATE
        config_value = VALUES(config_value),
        expires_at = VALUES(expires_at)
      `,
      [announcement, expiresAt || null]
    );

    await logAction(
      adminUserId,
      "UPDATE_ANNOUNCEMENT",
      "System"
    );

    res.json({ message: "Announcement saved" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save announcement" });
  }
};



exports.getAnnouncement = async (req, res) => {
  const [[row]] = await db.promise().query(`
    SELECT config_value, expires_at
    FROM systemconfig
    WHERE config_key = 'announcement'
      AND (expires_at IS NULL OR expires_at > NOW())
  `);

  res.json({
    announcement: row?.ConfigValue || "",
    expiresAt: row?.ExpiresAt || null
  });
};

exports.getSystemLogs = async (req, res) => {
  const [logs] = await db.promise().query(`
    SELECT
      l.log_id,
      l.action,
      l.target,
      l.created_at,
      u.user_email AS admin_email
    FROM systemlogs l
    JOIN user u ON u.user_id = l.admin_user_id
    ORDER BY l.created_at DESC
    LIMIT 20
  `);

  res.json(logs);
};
