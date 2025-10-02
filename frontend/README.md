MERN List Distribution System 
Comprehensive Installation and Configuration Guide



Table of Contents

Prerequisites Project Structure Backend Setup Frontend Setup
Database Configuration Running the Application Testing the Application Troubleshooting

Prerequisites

Required Softwares:
Node.js (version 14 )
MongoDB (Local installation or MongoDB Atlas account)
Git (for version control)
Web Browser (Chrome)


Verify Installation: node --version npm --version mongod -version

Project Structure

mern-list-distribution/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── App.js
│   └── package.json
└── README.md

Backend Setup

Create backend directory and initialize npm.
Install dependencies (express, mongoose, bcryptjs, JWT, multer, csv-parser, xlsx, dotenv).
Create file structure: models, routes, middleware, server.js, .env.
Configure .env with PORT=5001, MongoDB URI, JWT secret.
Add scripts to package.json.
Create models (User, ListDistribution), middleware (auth), and routes (auth.js, agents.js, lists.js).
Setup server.js with Express, MongoDB connection, CORS, and routes.

Frontend Setup

Create React app.
Install dependencies: axios, react-router-dom.
Setup file structure: components, contexts.
Create AuthContext.js for authentication state.
Build components (Login, Dashboard, Agents, ListUpload, ListDistribution, MyLists, Navbar).
Configure App.js with router and protected routes.
Apply CSS for styling.

Database Configuration

Option 1: Local MongoDB brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community mongosh

Option 2: MongoDB Atlas (Cloud)  —- ( Using ) 
Create cluster on https://www.mongodb.com/cloud/atlas
Update backend/.env with connection string.

Running the Application

Backend:(commands to start backend server)
cd backend
 npm run dev
Frontend:(commands to start front-end server)
cd frontend
 npm start

Access URL: 

Frontend: http://localhost:3000
 Backend: http://localhost:5001

Testing the Application

Create admin user with curl POST request.
Test login at http://localhost:3000.
Use dashboard, create agents, upload CSV files.
Verify distribution.


Sample CSV:

FirstName, Phone,Notes
John Doe,1234567890,Important client Jane Smith,0987654321,Follow up required

Troubleshooting

Common Issues:
Backend not starting ?  process on port 5001.
MongoDB connection failed ? Restart MongoDB service.
CORS errors ? Verify config and ports.
Frontend build errors ? Reinstall node_modules

Debugging:

CORS ORIGIN ERROR, verify env variables, Added admin user using curl 

Optimization:

-Use database indexing, caching.
Build frontend for production.
Secure JWT, env vars, and CORS settings.