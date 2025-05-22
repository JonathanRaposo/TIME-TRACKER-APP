# ⏱️ TimeTracker App

I created a simple time tracking system for employees, built with Node.js and Express.

## 📖 Project Description

**TimeTracker** is a Node.js-based employee time tracking app that allows employees to securely clock in and clock out, while automatically tracking work sessions and calculating wages based on hourly rates.

The app uses a **custom in-memory session system** backed by a JSON file for persistence. Each time an employee clocks in, a work session is created and stored with a UNIX timestamp. When they clock out, the duration is calculated and added to the employee's pay.

This project simulates real-world backend logic — including authentication, file-based data persistence, middleware, and dynamic pay updates — without relying on external databases or packages like `express-session`.

## 🚀 Features

- Employee clock in / clock out functionality
- Tracks working hours using UNIX timestamps
- Calculates total pay based on hourly rate
- Custom in-memory session storage (JSON-backed)
- Admin login and dashboard (if configured)
- Clean error handling and user-friendly forms

## 🛠️ Tech Stack

- Node.js
- Express.js
- Handlebars (HBS)
- JSON file as mock database
- Custom cookie and session management

## 📁 Folder Structure

## 💻 Setup Instructions

you can clone this repo and run in your computer to see it work:

- Clone the repo:
  ```bash
  git clone https://github.com/JonathanRaposo/TIME-TRACKER-APP.git
  cd timetracker
  ```
- npm install
- npm run dev
- visit http://localhost:5000
