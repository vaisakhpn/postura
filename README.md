🏋️ POSTURA – AI-Based Gym Management & Real-Time Posture Correction System

POSTURA is a full-stack gym management platform integrated with real-time AI posture correction.
It combines membership management, workout tracking, and computer vision–based exercise analysis into a single web application.

The system helps gym members maintain correct posture during exercises and assists gym owners in managing subscriptions and users efficiently.

🚀 Project Overview

POSTURA solves two major problems:

Manual gym management processes

Incorrect exercise posture leading to injuries

Using Computer Vision and Pose Estimation, the system analyzes body keypoints in real time and provides instant posture correction feedback.

🎯 Key Features
👤 Gym Member Features

Secure login & authentication

Workout module access

Real-time AI posture detection

Visual posture correction feedback

Subscription tracking

🏢 Gym Owner Features

Dashboard for managing members

Subscription and payment tracking

Exercise module management

Role-based access control

🤖 AI Posture Detection Module

Real-time pose estimation using keypoint detection

Angle calculation between joints

Exercise posture validation logic

Live visual feedback (correct/incorrect posture alerts)

Text-based posture improvement suggestions

🛠 Tech Stack
Frontend

React.js

Tailwind CSS

Single Page Application (SPA) Architecture

Backend

Node.js

Express.js

RESTful APIs

JWT Authentication

Role-Based Access Control (RBAC)

Database

MongoDB Atlas

AI / Computer Vision

Pose Detection / MediaPipe / TensorFlow (use what you actually used)

Deployment

Render (Backend/Frontend)

MongoDB Atlas (Cloud Database)

🧠 Core Concepts Implemented

REST API Design

Authentication Middleware

Role-Based Access Control

Real-Time Data Processing

Pose Estimation & Angle Computation

Modular Backend Architecture

Cloud Deployment

📦 System Architecture Overview

Main Modules:

Authentication Module

User & Owner Dashboard

Exercise Module

AI Pose Detection Engine

Subscription & Payment Tracking

Database Layer (MongoDB)

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/vaisakhpn/postura.git
cd postura
2️⃣ Install Dependencies
npm install
3️⃣ Configure Environment Variables

Create a .env file:

MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
4️⃣ Run the Application
npm run dev
📌 Future Improvements

Multi-angle posture detection

Mobile app integration (React Native)

Admin analytics dashboard

Performance tracking & progress reports

👨‍💻 Author

Vaisakh P N
Full-Stack Developer

GitHub: https://github.com/vaisakhpn

LinkedIn: https://www.linkedin.com/in/vaisakhpn/
