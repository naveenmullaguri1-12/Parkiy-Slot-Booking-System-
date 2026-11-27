# Parkiy-Slot-Booking-System-
# ParkEase — Parking Slot Booking System

A responsive full-stack parking management application built with HTML, CSS, JavaScript, Node.js and Express.

## Features
- Dashboard showing total, available, occupied and actively booked spaces
- Interactive 12-slot parking layout with color-coded availability
- Book a slot using owner name, vehicle registration and vehicle type
- Prevents booking an occupied slot or creating duplicate active bookings for a vehicle
- Vehicle check-out releases the slot automatically
- Booking history with search and status filters
- Persistent JSON-file storage

## Requirements
- Node.js 18+ (recommended)
- npm

## Run locally
1. Extract the project folder.
2. Open a terminal inside the project folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000` in your browser.

The application creates/uses `data/parking.json` for persistent storage. Back up this file if you want to preserve booking data.

## Project structure
```text
parking-slot-booking-system/
├── data/
│   └── parking.json
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── package.json
├── server.js
└── README.md
```

## API endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/slots` | Get all parking slots |
| GET | `/api/bookings` | Get booking history |
| GET | `/api/stats` | Get dashboard counts |
| POST | `/api/bookings` | Create a booking |
| PATCH | `/api/bookings/:id/checkout` | Check out a vehicle |

## GitHub submission
Create a new empty GitHub repository, then run these commands from this project folder:
```bash
git init
git add .
git commit -m "Initial commit - Parking Slot Booking System"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/parking-slot-booking-system.git
git push -u origin main
```
Replace `YOUR-USERNAME` with your GitHub username. Copy the repository URL into the project Excel sheet.

## Notes
This is a college-project starter implementation using local JSON storage. For a production deployment with multiple concurrent users, use a database such as MongoDB or PostgreSQL, add authentication/authorization, and deploy the server to a hosting provider.
