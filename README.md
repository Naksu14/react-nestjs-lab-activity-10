# 🎫 Activity 10 - Event Management System

A full-stack **Event Management System** built with **NestJS** (Backend) and **React** (Frontend). This application allows users to create, manage, and attend events with features like ticket generation, QR code scanning, and event announcements.

---

## 📋 Table of Contents

- [Project Description](#-project-description)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Requirements](#-requirements)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [How the App Works](#-how-the-app-works)
- [API Documentation](#-api-documentation)

---

## 📝 Project Description

This **Event Management System** is a comprehensive platform designed to streamline event organization and attendance. The system supports three user roles:

| Role          | Description                                                                                |
| ------------- | ------------------------------------------------------------------------------------------ |
| **Admin**     | Full system access - manage events, users, view reports, and oversee all activities        |
| **Organizer** | Create and manage their own events, scan tickets, manage attendees, and send announcements |
| **Attendee**  | Browse events, register for events, receive tickets with QR codes, and view their tickets  |

The application provides end-to-end event management from creation to check-in, with secure authentication and role-based access control.

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration and login
- JWT-based authentication
- Role-based access control (Admin, Organizer, Attendee)
- Password recovery (Forgot Password)

### 📅 Event Management

- Create, edit, and delete events
- Event image upload
- Set event capacity and schedule
- Event status management (Draft, Published, Cancelled, Completed)

### 🎟️ Ticketing System

- Automatic ticket generation upon registration
- Unique QR code for each ticket
- Ticket status tracking (Valid, Used, Cancelled)
- Email notifications for ticket issuance

### 📱 QR Code Check-in

- Scan QR codes to validate tickets
- Real-time check-in tracking
- Scan history and status

### 📢 Announcements

- Send event announcements to attendees
- Track announcement history

### 📊 Reports & Analytics (Admin)

- View event statistics
- User management reports

---

## 🛠️ Tech Stack

### Backend

| Technology      | Purpose                                                 |
| --------------- | ------------------------------------------------------- |
| **NestJS**      | Node.js framework for building server-side applications |
| **TypeORM**     | ORM for database interactions                           |
| **MySQL**       | Relational database                                     |
| **Passport.js** | Authentication middleware                               |
| **JWT**         | Token-based authentication                              |
| **Swagger**     | API documentation                                       |
| **bcrypt**      | Password hashing                                        |
| **QRCode**      | QR code generation                                      |
| **Nodemailer**  | Email service                                           |

### Frontend

| Technology          | Purpose                     |
| ------------------- | --------------------------- |
| **React 19**        | Frontend library            |
| **React Router v7** | Client-side routing         |
| **TanStack Query**  | Data fetching and caching   |
| **Tailwind CSS**    | Utility-first CSS framework |
| **Axios**           | HTTP client                 |
| **Lucide React**    | Icon library                |
| **html5-qrcode**    | QR code scanner             |
| **qrcode.react**    | QR code display             |

---

## 📌 Requirements

Before setting up the project, ensure you have the following installed:

| Requirement | Version         |
| ----------- | --------------- |
| **Node.js** | v18.x or higher |
| **npm**     | v9.x or higher  |
| **MySQL**   | v8.x or higher  |

---

## 📁 Project Structure

```
Activity-10/
├── package.json                    # Root package.json (monorepo scripts)
│
├── activity10-event-backend/       # NestJS Backend
│   ├── src/
│   │   ├── main.ts                 # Application entry point
│   │   ├── app.module.ts           # Root module
│   │   ├── config/
│   │   │   └── typeorm.config.ts   # Database configuration
│   │   └── modules/
│   │       ├── auth/               # Authentication module
│   │       ├── events/             # Events management
│   │       ├── event-users/        # User management
│   │       ├── event-tickets/      # Ticket management
│   │       ├── event-registrations/# Registration handling
│   │       ├── event-checkins/     # Check-in management
│   │       └── event-announcements/# Announcements
│   ├── event-images/               # Uploaded event images
│   └── package.json
│
└── activity10-event-frontend/      # React Frontend
    ├── src/
    │   ├── App.js                  # Main app component
    │   ├── routers/                # Route definitions
    │   ├── modules/                # Page components
    │   │   ├── auth/               # Login, Signup, Forgot Password
    │   │   └── pages/              # Admin, Organizer, Attendee pages
    │   ├── components/             # Reusable components
    │   ├── services/               # API service functions
    │   ├── context/                # React Context (Auth)
    │   └── hooks/                  # Custom React hooks
    └── package.json
```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Activity-10
```

### Step 2: Install Root Dependencies

```bash
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd activity10-event-backend
npm install
```

<details>
<summary>📦 Backend Dependencies List</summary>

**Production Dependencies:**

- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` - NestJS framework
- `@nestjs/config` - Configuration management
- `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt` - Authentication
- `@nestjs/typeorm`, `typeorm`, `mysql2` - Database ORM
- `@nestjs/swagger` - API documentation
- `bcrypt` - Password hashing
- `class-transformer`, `class-validator` - Data validation
- `nodemailer` - Email service
- `qrcode` - QR code generation
- `uuid` - Unique ID generation

**Dev Dependencies:**

- `typescript` - TypeScript compiler
- `eslint`, `prettier` - Code linting and formatting
- `jest` - Testing framework

</details>

### Step 4: Install Frontend Dependencies

```bash
cd ../activity10-event-frontend
npm install
```

<details>
<summary>📦 Frontend Dependencies List</summary>

**Production Dependencies:**

- `react`, `react-dom` - React library
- `react-router-dom` - Routing
- `@tanstack/react-query` - Data fetching
- `axios` - HTTP client (from root)
- `lucide-react`, `react-icons` - Icons
- `qrcode.react` - QR code display
- `html5-qrcode` - QR code scanner

**Dev Dependencies:**

- `tailwindcss` - CSS framework

</details>

---

## ⚙️ Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `activity10-event-backend` folder:

```env
# Server Configuration
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=event_management_db
DB_SYNC=true

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRATION=1d

# Email Configuration (Optional - for ticket emails)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
```

### Frontend Environment Variables

Create a `.env` file in the `activity10-event-frontend` folder:

```env
REACT_APP_API_URL=http://localhost:3000
```

### Database Setup

1. **Create the MySQL database:**

```sql
CREATE DATABASE event_management_db;
```

2. **Set `DB_SYNC=true`** in your backend `.env` file to auto-create tables on first run.

> ⚠️ **Note:** Set `DB_SYNC=false` in production to prevent accidental data loss.

---

## ▶️ Running the Application

### Option 1: Run Both Services Together (Recommended)

From the root `Activity-10` folder:

```bash
npm run dev
```

This will start both the backend and frontend concurrently.

### Option 2: Run Services Separately

**Terminal 1 - Backend:**

```bash
cd activity10-event-backend
npm run start:dev
```

**Terminal 2 - Frontend:**

```bash
cd activity10-event-frontend
npm start
```

### Access the Application

| Service                         | URL                            |
| ------------------------------- | ------------------------------ |
| **Frontend**                    | http://localhost:3001          |
| **Backend API**                 | http://localhost:3000          |
| **API Documentation (Swagger)** | http://localhost:3000/api/docs |

---

## 🔄 How the App Works

### High-Level Architecture

```
┌─────────────────┐      HTTP/REST       ┌─────────────────┐
│                 │  ◄─────────────────► │                 │
│  React Frontend │                      │  NestJS Backend │
│  (Port 3001)    │                      │  (Port 3000)    │
│                 │                      │                 │
└─────────────────┘                      └────────┬────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │                 │
                                         │  MySQL Database │
                                         │                 │
                                         └─────────────────┘
```

### Backend Flow

1. **Request Handling**

   - Incoming HTTP requests are received by NestJS controllers
   - JWT authentication middleware validates tokens for protected routes
   - Request data is validated using class-validator decorators

2. **Business Logic**

   - Services contain the business logic
   - TypeORM repositories handle database operations
   - Entities define the database schema

3. **Database Schema**

| Entity              | Description                                        |
| ------------------- | -------------------------------------------------- |
| `EventUser`         | User accounts (Admin, Organizer, Attendee)         |
| `Event`             | Event details (title, description, date, capacity) |
| `EventRegistration` | Links users to events they registered for          |
| `EventTicket`       | Generated tickets with unique QR codes             |
| `EventCheckin`      | Records of ticket scans                            |
| `EventAnnouncement` | Messages sent to event attendees                   |

4. **API Endpoints (Main)**

| Method | Endpoint               | Description                    |
| ------ | ---------------------- | ------------------------------ |
| POST   | `/auth/login`          | User login                     |
| POST   | `/event-users/signup`  | User registration              |
| GET    | `/events`              | List all events                |
| POST   | `/events`              | Create event (Organizer/Admin) |
| POST   | `/event-registrations` | Register for event             |
| GET    | `/event-tickets`       | Get user's tickets             |
| POST   | `/event-checkins`      | Check-in with ticket           |
| POST   | `/event-announcements` | Send announcement              |

### Frontend Flow

1. **Authentication**

   - Users log in via the Login page
   - JWT token is stored in `localStorage`
   - `AuthContext` provides auth state globally

2. **Routing & Protected Routes**

   - React Router handles navigation
   - `ProtectedRoute` component checks user roles
   - Redirects unauthorized users

3. **Page Structure by Role**

| Role          | Accessible Pages                                         |
| ------------- | -------------------------------------------------------- |
| **Public**    | Landing, Login, Signup, Forgot Password, Events, Tickets |
| **Admin**     | Events Management, User Management, Reports, All Tickets |
| **Organizer** | My Events, Attendees, QR Scanner, Announcements          |

4. **Data Fetching**

   - `TanStack Query` handles API calls with caching
   - Service files (`authService.js`, `eventsService.js`, etc.) contain API functions
   - Axios interceptors add auth headers automatically

5. **User Experience Flow**

```
┌──────────────┐    ┌─────────────┐    ┌────────────────┐
│  Landing     │───►│   Login /   │───►│  Dashboard     │
│  Page        │    │   Signup    │    │  (Role-based)  │
└──────────────┘    └─────────────┘    └────────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
            ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
            │   Attendee   │         │   Organizer  │         │    Admin     │
            ├──────────────┤         ├──────────────┤         ├──────────────┤
            │ • View Events│         │ • My Events  │         │ • All Events │
            │ • Register   │         │ • Attendees  │         │ • Users      │
            │ • My Tickets │         │ • QR Scanner │         │ • Reports    │
            │              │         │ • Announce   │         │ • Tickets    │
            └──────────────┘         └──────────────┘         └──────────────┘
```

---

## 📚 API Documentation

Once the backend is running, access the **Swagger UI** for interactive API documentation:

🔗 **http://localhost:3000/api/docs**

Features:

- View all available endpoints
- Test API calls directly from the browser
- See request/response schemas
- Authenticate with JWT for protected routes

---

## 🧪 Testing

### Backend Tests

```bash
cd activity10-event-backend
npm run test        # Unit tests
npm run test:e2e    # End-to-end tests
npm run test:cov    # Coverage report
```

### Frontend Tests

```bash
cd activity10-event-frontend
npm test
```

---

## 📝 License

This project is for educational purposes as part of ITEC-116 Laboratory Activities.

---

