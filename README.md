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

## 📂 Project Structure

```
quiz-app/
│
├── client/                # React Frontend
│   ├── src/
│   └── package.json
│
├── server/                # Node + Express Backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/mern-quiz-app.git
cd mern-quiz-app
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm start
```

The backend will run on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm start
```

The frontend will run on:

```
http://localhost:3000
```

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

## 📸 Screenshots

Add your application screenshots here.

Example:

```
![Home Page](./screenshots/home.png)
![Quiz Page](./screenshots/quiz.png)
```

---

## 🚀 Future Improvements

- 🏆 Leaderboard system
- 📊 Admin dashboard
- 🎯 Category-based quizzes
- 🔔 Email notifications
- 🌙 Dark mode support
- 🌍 Deployment (Render / Vercel / MongoDB Atlas)

---

## 🤝 Contributing

Contributions are welcome.  
Fork the repository and create a pull request with your improvements.

---

## 📄 License

This project is licensed under the MIT License.

---

### ⭐ If you found this project useful, consider giving it a star!
