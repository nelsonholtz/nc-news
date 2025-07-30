# 🛠️ NC News – Backend API

This is the backend server for **NC News**, a full-stack social news platform where users can browse articles, post content, join discussions, and vote on stories or comments. The backend provides a RESTful API built with **Express.js** and **PostgreSQL**, handling all data logic, routing, and database operations. You can explore the API endpoints locally or via the hosted documentation.

## 📚 About

NC News was designed to mimic the core functionality of a site like Reddit. This backend service handles:

- 📰 Retrieving all articles or filtering by topic
- 📌 Viewing individual articles (with comment count)
- 💬 Adding and deleting comments
- 👍 Voting on articles and comments
- 🧑 Viewing users
- 📂 Accessing available topics

It was built using **Node.js**, with **Express** for routing, and **PostgreSQL** as the relational database. Testing is done with **Jest** and **Supertest**, and **dotenv** is used to manage environment variables.

## 🔗 Live API

🌐 Hosted at: **[Coming Soon / Add Your Link]**  
📄 API Documentation: Once the server is running locally, visit `http://localhost:9090/api` to view the full API documentation.

## ⚙️ Getting Started

Follow these steps to get the backend running locally:

### 1. Clone the repository

```bash
git clone https://github.com/nelsonholtz/nc-news.git
cd nc-news
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment files

Create two `.env` files in the root of the project with the following contents:

`.env.development`

```
PGDATABASE=nc_news
```

`.env.test`

```
PGDATABASE=nc_news_test
```

### 4. Set up the PostgreSQL database

Make sure PostgreSQL is running, then run:

```bash
npm run setup-dbs
npm run seed
```

This creates the development and test databases and seeds them with test data.

### 5. Start the server

```bash
npm start
```

The server will run by default on `http://localhost:9090`.

## 🧪 Running Tests

To run all backend tests:

```bash
npm test
```

Tests cover endpoints, error handling, and edge cases using **Jest** and **Supertest**.

## 🛠 Tech Stack

- **Node.js** – JavaScript runtime
- **Express.js** – Server framework
- **PostgreSQL** – Relational database
- **pg** – PostgreSQL client for Node.js
- **dotenv** – For environment variable management
- **Jest** – Testing framework
- **Supertest** – For endpoint testing

## 👨‍💻 Author

Nelson Holtz - Made as part of the North Coders Bootcamp

GitHub: [@nelsonholtz](https://github.com/nelsonholtz)
