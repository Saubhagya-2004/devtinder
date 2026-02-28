# DevTinder - MERN Stack 🔥

A full-stack web application built with the MERN stack (MongoDB, Express.js, React, Node.js) specifically for developers to find collaborators, make connections, and chat in real-time.

## ✨ Features

- **Secure Authentication**
  - JWT token-based login/signup with OTP verification via Nodemailer
  - Password encryption using Bcrypt
  - Protected routes

- **Developer Matching**
  - Swipe left/right functionality (Interested / Ignored)
  - Connection requests handling (Accept / Reject)
  - Matches feed page filtered by preferences

- **Real-time Chat**
  - WebSocket implementation using Socket.io
  - Real-time messaging with your connections
  - Online status indicators

- **User Profiles**
  - Profile creation and editing
  - Real-time Photo uploads directly to Cloudinary
  - Skills, profession, and preference settings

## 🛠 Tech Stack

**Frontend:**
- React.js (v19)
- Vite (Build Tool)
- Redux Toolkit (State Management)
- Tailwind CSS v4 & DaisyUI (Styling & Components)
- React Router DOM (Navigation)
- Axios (API Requests)
- Socket.io-client (Real-time communication)
- React Hot Toast (Notifications)
- Lucide React (Icons)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database & ORM)
- JWT (Authentication)
- Bcrypt (Password Hashing)
- Socket.io (WebSocket Server)
- Cloudinary & Multer (Image Uploads & Storage)
- Nodemailer (Email & OTP functionality)
- Validator (Data Validation)

## 🚀 Installation

1. Clone the repo
```bash
git clone https://github.com/Saubhagya-2004/devtinder.git
cd devtinder

