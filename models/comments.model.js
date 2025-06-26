const db = require("../db/connection");

const fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

const removeCommentById = (comment_id) => {
  const comment_id_toNumber = Number(comment_id);
  if (isNaN(comment_id_toNumber)) {
    return Promise.reject({ status: 400, msg: "400 Bad Request" });
  }

  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id_toNumber,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      }
      return;
    });
};

const updateCommentVote = (comment_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "400 Bad Request" });
  }

  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;",
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      }
      return rows[0];
    });
};

module.exports = { fetchTopics, removeCommentById, updateCommentVote };
