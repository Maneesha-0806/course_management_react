# AcademiaX Project Context

This document describes the implementation currently present in the repository. Source code and configuration are authoritative if this document becomes stale. Update this file when a significant architecture, route, data-contract, or persistence change is made.

## 1. Project overview

- Product: AcademiaX
- Type: React single-page course-management and e-learning application
- Repository root: `course_management_system_react`
- Frontend: `academiax-frontend`
- Backend API: `backend` (Node.js/Express)
- Mock data API: `mock-api` (json-server)
- Current maturity: coursework/prototype application, transitioning to a real backend.
- Languages: JavaScript, JSX, and CommonJS JavaScript in the backend
- UI library: Chakra UI
- Frontend build tool: Vite

The application has two role-oriented experiences:

1. Students can browse courses, enroll, view learning content, submit assignments, read notifications, and view certificates.
2. Admin/faculty users can view dashboard metrics, manage courses, inspect rosters, and review or grade assignments.

The implementation currently uses a **hybrid API architecture**:

- **Authentication & Courses (Port 5005):** The Express backend now securely handles user registration, JWT-based login, and all Course CRUD operations. 
- **Learning Features (Port 5000):** The mock `json-server` API still handles enrollments, submissions, and notifications.

## 2. Repository layout

```text
course_management_system_react/
├── project-context.md
├── academiax-frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
│           ├── api.js           # json-server client (Port 5000)
│           └── apiClient.js     # Express API client with JWT interceptor (Port 5005)
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── courseController.js
│   ├── data/
│   │   ├── courses.js           # In-memory courses array
│   │   └── students.js          # In-memory users array
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── authValidation.js    
│   │   ├── courseValidation.js
│   │   ├── errorMiddleware.js
│   │   └── notFoundMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── courseRoutes.js
│   └── services/
│       ├── authService.js
│       └── courseService.js
└── mock-api/
    ├── db.json
    └── package.json
```

## 3. Technology and commands

### Frontend dependencies

- React `19.2.8`, Vite `8.3.0`, React Router DOM `7.18.4`, Chakra UI `2.8.2`, Axios `1.20.0`

### Backend dependencies (Express)

- `express`, `cors`, `dotenv`, `morgan`
- `bcryptjs` (Password hashing)
- `jsonwebtoken` (JWT creation/verification)

### Express API (Port 5005)

Run from `backend`:
```powershell
npm run dev       # nodemon server.js
```
The server runs on port `5005` to avoid Windows OS conflicts. 

Available endpoints:
```text
POST   /api/v1/auth/register    # Hashes password, saves to memory
POST   /api/v1/auth/login       # Verifies hash, returns JWT
GET    /api/v1/courses          # Public
GET    /api/v1/courses/:id      # Public
POST   /api/v1/courses          # Protected (Requires JWT)
PUT    /api/v1/courses/:id      # Protected (Requires JWT)
DELETE /api/v1/courses/:id      # Protected (Requires JWT)
```

### Mock API (Port 5000)

Run from `mock-api`:
```powershell
npx json-server db.json --port 5000
```
Required for enrollments, submissions, and notifications.

## 4. Frontend runtime architecture

The provider tree is located in `src/main.jsx`.

```text
ChakraProvider
└── BrowserRouter
    └── AuthProvider         <-- Backed by Express (apiClient.js)
        └── CourseProvider   <-- Backed by Express (apiClient.js)
            └── EnrollmentProvider   <-- Backed by json-server (api.js)
                └── SubmissionProvider
                    └── NotificationProvider
                        └── App
```

## 5. Authentication and Authorization

### Session Behavior (JWT)

Authentication is now fully integrated with the Express backend.
- **Login:** `loginStudent` posts to `/api/v1/auth/login`. Express compares the password against the `bcryptjs` hash and returns a signed JSON Web Token (JWT).
- **Storage:** The JWT is saved in `localStorage.token`. The user object is saved in `localStorage.user`.
- **Interceptor:** `src/services/apiClient.js` automatically intercepts all requests and attaches `Authorization: Bearer <token>`.

### The Authorization Split (Frontend vs. Backend)

- **Backend Authentication:** The Express `authMiddleware.js` only verifies that a token is valid (Authentication). It does *not* check if the user is an admin. Technically, any logged-in student has the API credentials to create a course.
- **Frontend Authorization:** The application relies entirely on the React frontend to prevent students from accessing admin features. `ProtectedRoute.jsx` intercepts routes requiring the `admin` role and forcefully redirects students back to the student dashboard.

Because the UI strictly blocks navigation, a valid student cannot access the "Add Course" form, bridging the authorization gap for this prototype.

## 6. API boundaries and persistence

### Express Client (`src/services/apiClient.js`)
Configured to `http://localhost:5005/api/v1`. Used exclusively by `AuthContext` and `CourseContext`. It automatically injects the JWT.
- **Data Persistence:** Student accounts and Courses are stored in Javascript arrays (`data/students.js` and `data/courses.js`). **This data is volatile and resets every time the Node.js server restarts.**

### Legacy Mock Client (`src/services/api.js`)
Configured to `http://localhost:5000`. Used by `EnrollmentContext`, `SubmissionContext`, and `NotificationContext`.
- **Data Persistence:** Read/Writes are saved permanently to `mock-api/db.json`.

### Data Contract Resolution
The course fields have been standardized for the Express backend. The backend strictly requires `title`, `instructor`, `category`, and `description`. `AdminCourses.jsx` and `CourseForm.jsx` have been updated to map to `title` instead of the legacy `courseName` format.

## 7. Page and component responsibilities

### Context/service files

- `AuthContext.jsx`: Calls Express to register/login, saves JWT to localStorage, handles logout.
- `CourseContext.jsx`: Express-backed course CRUD using the authenticated `apiClient`.
- `apiClient.js`: Secure Axios instance pointing to `5005` with a JWT interceptor.
- `api.js`: Legacy Axios instance pointing to `5000` for `json-server` features.

### Admin pages

- `AdminDashboard.jsx`: Live Chakra UI dashboard combining Express course counts, json-server enrollment counts, and json-server pending submissions.
- `AdminCourses.jsx`: Express-backed course list with delete functionality (uses `course.title`).
- `CourseForm.jsx`: Express-backed form for course creation/editing, fully matching the backend validation middleware.

## 8. Known limitations and inconsistencies

- **Volatile Storage:** Express data (Auth/Courses) is held in memory and will wipe if the server process is killed or Nodemon restarts.
- **Backend Authorization:** Express does not verify user roles for course modifications; it relies entirely on the React `<ProtectedRoute>` to keep students out of the admin UI.
- **Split Databases:** The frontend fetches courses and user sessions from Express, but still relies on `json-server` for enrollments and grading. As a result, relationships (like enrolling in a newly created Express course) work in the UI but exist across two different backend paradigms.
- **Mock Roles:** Express currently registers everyone as a student. The `AuthContext` manually injects the `admin` role on the frontend during login if the user logged in via the `/admin/login` portal.

## 9. Definition of done

For a normal feature or bug fix:

- The owning component/context/service is changed.
- If it is Auth or Course related, it uses `apiClient.js` (Port 5005).
- If it is Enrollment/Submission related, it uses `api.js` (Port 5000).
- `npm run lint` and `npm run build` pass.
- Manual API-dependent behavior is checked with Express running on `5005` and json-server running on `5000`.
- Related data-contract or persistence changes are reflected in this document.