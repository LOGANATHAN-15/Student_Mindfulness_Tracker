# Student Mindfulness Activity Tracker

A full-stack MERN (MongoDB, Express, React, Node.js) application for tracking mindfulness activities.

## Project Architecture

- **backend/**: Node.js/Express server with MongoDB.
- **frontend/**: React (Vite) client with vanilla CSS styling.

## Prerequisites

- Node.js installed.
- MongoDB installed and running locally (`mongodb://localhost:27017`).

## Getting Started

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000`.

### Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## Features

- **Authentication**: Secure Login/Register with JWT & bcryptjs.
- **Dashboard**: Overview of user activities.
- **Activity Logging**: Track Meditation, Yoga, and Breathing exercises.
- **Activity History**: View and delete past activities.
- **Responsive Design**: Mobile-friendly interface with modern styling.
- **Ethical Requirement**: Medical disclaimer in the footer.

## Technologies

- MongoDB, Mongoose
- Express.js
- React.js (Vite)
- Node.js
- JWT Authentication
- Clean CSS (No framework)
