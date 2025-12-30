const db = require("../config/db");
const bcrypt = require("bcryptjs");

// =========================
// REGISTER
// =========================
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️ Create user
    const [result] = await db.promise().query(
      `INSERT INTO user (user_email, password_hash, is_active, registered_at)
      VALUES (?, ?, 1, NOW())`,
      [email, hashedPassword]
    );

    const userId = result.insertId;

    // 2️ Auto create empty profile
    await db.promise().query(
      `INSERT INTO user_profile (user_id) VALUES (?)`,
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
    // 1️ Get active user by email
    const [[user]] = await db.promise().query(
      `
      SELECT 
         user_id,
        user_email,
        password_hash,
        is_active
      FROM user
      WHERE user_email = ?
      `,
      [email]
    );

    // 2️ User not found
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️ Check account active
    if (!user.IsActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    // 4️ Password check
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 5️ Update last login time
    await db.promise().query(
      "UPDATE user SET last_login_at = NOW() WHERE user_id = ?",
      [user.user_id]
    );

    // 6️ Detect role
    let role = "user";

    const [[admin]] = await db.promise().query(
      "SELECT admin_id FROM admin WHERE user_id = ?",
      [user.user_id]
    );

    if (admin) role = "admin";

    //  Response
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
        u.user_id,
        u.user_email,
        u.is_active,
        u.last_login_at,
        up.user_first_name,
        up.user_last_name,
        up.user_gender,
        up.user_contact,
        DATE_FORMAT(up.user_date_of_birth, '%Y-%m-%d') AS user_date_of_birth,
        CASE
          WHEN a.admin_id IS NOT NULL THEN 'Admin'
          ELSE 'User'
        END AS role
      FROM user u
      LEFT JOIN user_profile up ON up.user_id = u.user_id
      LEFT JOIN admin a ON a.user_id = u.user_id
      WHERE u.user_id = ?
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
      "SELECT profile_id  FROM user_profile  WHERE user_id  = ?",
      [userId]
    );

    // If profile does NOT exist → INSERT
    if (!profile) {
      await db.promise().query(
        `
        INSERT INTO user_profile
        (user_id, user_first_name, user_last_name, user_contact, user_gender, user_date_of_birth, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
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
        UPDATE user_profile
        SET 
          user_first_name = ?,
          user_last_name = ?,
          user_contact = ?,
          user_gender = ?,
          user_date_of_birth = ?
        WHERE user_id  = ?
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

    // 1️ Get user
    const [[user]] = await db.promise().query(
      "SELECT password_hash FROM user  WHERE user_id = ?",
      [userId]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️ Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password incorrect" });
    }

    // 3️ Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // 4️ Update DB
    await db.promise().query(
      "UPDATE Users SET password_hash  = ? WHERE user_id = ?",
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
        u.user_id,
        u.user_email,
        u.is_active,
        u.registered_at,
        u.last_login_at,
        CASE
          WHEN a.admin_id IS NOT NULL THEN 'Admin'
          ELSE 'User'
        END AS role
      FROM user u
      LEFT JOIN admin a ON a.user_id = u.user_id
      ORDER BY u.user_id ASC
    `);

    res.json(rows);
  } catch (err) {
    console.error("GET ALL USERS ERROR:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
};
