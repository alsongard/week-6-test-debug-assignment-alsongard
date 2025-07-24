
# 🐞 Bug Tracker App

A full-stack web application for tracking and managing bug reports. This project enables users to report bugs, view their submissions, and allows admins to manage all bug reports and users. Built with modern technologies for both frontend and backend, and includes robust authentication and testing.

---

## 🚀 Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express, Mongoose (MongoDB)
- **Authentication:** JWT (JSON Web Token)
- **Testing:** Jest, Supertest

---

## ✨ Features

### User
- Register a new account
- Sign in to access bug reporting features
- Report new bugs (name, level, description, status)
- View all bugs reported by the user

### Admin
- Login via `/admin_login` endpoint
- View all users
- View all bugs
- Delete bug reports
- Update bug reports

---

## 📁 Folder Structure

```
├── client/         # Frontend React app (Vite)
├── server/         # Backend Express app
│   ├── models/     # Mongoose models
│   └── tests/      # Server-side tests (Jest & Supertest)
```

---

## ⚡ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   ```
2. **Install dependencies**
   - Frontend:
     ```bash
     cd client
     npm install
     ```
   - Backend:
     ```bash
     cd server
     npm install
     ```
3. **Configure environment variables**
   - Backend: Create a `.env` file for MongoDB URI, JWT secret, and port
4. **Run the application**
   - Backend:
     ```bash
     npm start
     # or
     node server.js
     ```
   - Frontend:
     ```bash
     npm run dev
     ```
5. **Access the app**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:5001](http://localhost:5000)

---

## 🧪 Testing

- Server-side tests are located in `server/tests/`
- Run tests with:
  ```bash
  npm test
  ```
- Tests use Jest and Supertest to validate API endpoints

---

## 📚 API Endpoints

| Endpoint         | Method | Description                              |
|------------------|--------|------------------------------------------|
| `/register`      | POST   | Register a new user                      |
| `/login`         | POST   | User login                               |
| `/bug`           | POST   | Report a new bug                         |
| `/bugs`          | GET    | View all bugs                            |
| `/bug/:id`       | GET    | View a specific bug                      |
| `/bug/:id`       | PUT    | Update a specific bug                    |
| `/bug/:id`       | DELETE | Delete a specific bug                    |
| `/admin_login`   | POST   | Admin login                              |
| `/admin`         | POST   | Admin actions (view users, view bugs, update/delete bugs) |

---

## 🖥️ Usage Example

### Register a User
```bash
curl -X POST http://localhost:5000/register -H "Content-Type: application/json" -d '{"userEmail":"test@example.com","userPassword":"password123"}'
```

### Report a Bug
```bash
curl -X POST http://localhost:5000/bug -H "Content-Type: application/json" -d '{"bugname":"Login Error","buglevel":"high","bugDescription":"Cannot login with valid credentials","bugStatus":"report"}'
```

---



## 📄 License

MIT
