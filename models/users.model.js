const db = require("../db/connection");

const fetchUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

const fetchUserByUserName = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1;", [username])
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports = { fetchUsers, fetchUserByUserName };
