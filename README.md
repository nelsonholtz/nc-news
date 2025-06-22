NC News Backend API

This is the backend for a news app it lets users:

- View all articles
- Filter articles by topic
- See comment counts
- Add and delete comments
- Vote on articles and comments
- View users and topics

---

Live API

🔗 Hosted at: find out

---

How to Run Locally

1. clone repo

```bash
git clone https://github.com/nelsonholtz/nc-news.git

2. Install packages
npm install

3. Add environment files

## .env.development

PGDATABASE=nc_news

## .env.test

PGDATABASE=nc_news_test

4. Set up the database

npm run setup-dbs
npm run seed

5. Start the server

npm start

 Run Tests
npm test

```

Built with:

- Node.js
- Express
- PostgreSQL
- pg (Postgres client)
- dotenv (for environment variable config)
- Jest & Supertest (for testing)
