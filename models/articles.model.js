const db = require("../db/connection");

const fetchArticles = () => {
  const queryStr = `
    SELECT 
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY 
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url
    ORDER BY articles.created_at DESC;
  `;

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

module.exports = { fetchArticles };
