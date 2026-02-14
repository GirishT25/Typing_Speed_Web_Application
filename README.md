🚀 Typing Speed Web Application

A full-stack web application that measures typing speed (WPM) and accuracy in real-time with secure authentication, performance tracking, and DevOps automation.

🔗 Live Demo

(Add your deployed link here if available)

🛠️ Tech Stack

Frontend

React.js

Tailwind CSS

Framer Motion

React Router

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

DevOps

Docker

Redis

Jenkins (CI/CD)

Nginx Reverse Proxy

✨ Key Features

⌨️ Real-time typing speed & accuracy calculation

🔐 Secure JWT-based authentication

📊 User performance history tracking

⚡ Redis caching for improved performance

🐳 Fully containerized with Docker

🔁 Automated CI/CD pipeline using Jenkins

📱 Responsive UI design


🏗️ Architecture Overview
React Frontend → Nginx → Node/Express API → MongoDB
                               ↓
                             Redis
Installation Guide
1️⃣ Clone Repository
git clone https://github.com/your-username/typing-speed-app.git
cd typing-speed-app

2️⃣ Setup Backend
cd server
npm install
npm start

3️⃣ Setup Frontend
cd client
npm install
npm start

🐳 Run with Docker
docker-compose up --build


App will run on:

http://localhost:3000

🔐 Environment Variables

Create a .env file inside server/:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
REDIS_HOST=redis
REDIS_PORT=6379

📌 CI/CD Pipeline

The Jenkins pipeline:

Pulls latest code

Builds Docker images

Runs tests

Deploys containers automatically

🚀 Future Improvements

🏆 Leaderboard system

👥 Multiplayer mode

📈 Advanced analytics dashboard

☁️ Kubernetes deployment

👨‍💻 Author

Girish Thorat
Full Stack & DevOps Enthusiast
