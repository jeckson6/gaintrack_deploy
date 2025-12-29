const db = require("../config/db");

module.exports = async function logAction(adminUserId, action, target) {
  await db.promise().query(
    `
    INSERT INTO SystemLogs (AdminUserID, Action, Target)
    VALUES (?, ?, ?)
    `,
    [adminUserId, action, target]
  );
};
