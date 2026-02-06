# 🧠 MERN Stack Quiz Application

A full-stack Quiz Application built using the MERN stack (MongoDB, Express.js, React.js, Node.js).  
This application allows users to register, log in, attempt quizzes, and view their results instantly with a responsive and modern UI.

---

## 🚀 Features

- 🔐 User Authentication (Register / Login with JWT)
- 📝 Create and Attempt Quizzes
- ⏳ Timer-based quiz system
- 📊 Real-time score calculation
- 📈 Result summary after submission
- 📱 Fully responsive design
- 🗄️ MongoDB database integration
- 🌐 RESTful API architecture

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- CSS / Tailwind CSS (if used)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt.js

---

## 🔐 Environment Variables

| Variable     | Description                         |
|--------------|-------------------------------------|
| MONGO_URI    | MongoDB connection string           |
| JWT_SECRET   | Secret key for JWT authentication   |
| PORT         | Backend server port                 |

---

## 🌍 API Endpoints (Sample)

| Method | Endpoint                | Description         |
|--------|-------------------------|---------------------|
| POST   | /api/auth/register      | Register new user   |
| POST   | /api/auth/login         | Login user          |
| GET    | /api/quiz               | Get all quizzes     |
| POST   | /api/quiz               | Create new quiz     |
| POST   | /api/quiz/submit        | Submit quiz answers |

---
