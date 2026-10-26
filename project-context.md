# AcademiaX Project Context

This document describes the implementation currently present in the repository. Source code and configuration are authoritative if this document becomes stale. Update this file when a significant architecture, route, data-contract, or persistence change is made.

## 1. Project overview

- Product: AcademiaX
- Type: React single-page course-management and e-learning application
- Repository root: `course_management_system_react`
- Frontend: `academiax-frontend`
- Course API: `backend`
- Mock data API: `mock-api`
- Current maturity: coursework/prototype application, not production-ready
- Languages: JavaScript, JSX, and CommonJS JavaScript in the backend
- UI library: Chakra UI
- Frontend build tool: Vite

The application has two role-oriented experiences:

1. Students can browse courses, enroll, view learning content, submit assignments, read notifications, and view certificates.
2. Admin/faculty users can view dashboard metrics, manage courses, inspect rosters, and review or grade assignments.

The implementation currently uses two independent local APIs:

- The frontend course context calls the Express service in `backend` on port `5005`.
- Authentication and the enrollment, submission, and notification contexts call json-server in `mock-api` at the hard-coded Axios base URL `http://localhost:5000`.

The Express backend does not currently provide authentication, users, enrollments, submissions, or notifications. The frontend therefore has a split data model and split persistence behavior.

## 2. Repository layout

```text
course_management_system_react/
├── project-context.md
├── academiax-frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── index.html
│   ├── README.md              # Unmodified Vite template documentation
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── theme.js
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── routes/
│   └── services/
└── mock-api/
    ├── db.json
    └── package.json
```

There is no `src/styles` directory in the current frontend. Global styling is in `academiax-frontend/src/index.css`; most page styling uses Chakra UI props.

## 3. Technology and commands

### Frontend dependencies

- React `19.2.8`
- React DOM `19.2.8`
- Vite `8.3.0`
- React Router DOM `7.18.4`
- Chakra UI `2.8.2`
- Emotion React/styled
- Axios `1.20.0`
- Framer Motion `13.4.0`
- ESLint `10.10.0`
- `@vitejs/plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`

### Frontend scripts

Run from `academiax-frontend`:

```powershell
npm install
npm run dev       # Start Vite
npm run build     # Build production assets
npm run lint      # Run ESLint
npm run preview   # Serve the production build
```

No frontend test script or test runner is configured, and no automated tests are present in the repository.

### Express course API

Run from `backend`:

```powershell
npm install
npm start         # node server.js
npm run dev       # nodemon server.js
```

`backend/server.js` always listens on port `5005`, regardless of environment variables. It enables CORS, JSON/urlencoded request parsing, Morgan logging, a root status response, health checking, course routes, and JSON error/not-found middleware.

Useful endpoints:

```text
GET    http://localhost:5005/
GET    http://localhost:5005/api/health
GET    http://localhost:5005/api/v1/courses
GET    http://localhost:5005/api/v1/courses/:id
POST   http://localhost:5005/api/v1/courses
PUT    http://localhost:5005/api/v1/courses/:id
DELETE http://localhost:5005/api/v1/courses/:id
```

Course data is held in the Node process by `backend/data/courses.js`. Create, update, and delete operations mutate that in-memory array and are lost when the server restarts.

### json-server mock API

Run from `mock-api`:

```powershell
npm install
npm start         # json-server --watch db.json --port 5002
```

The package script starts json-server on port `5002`, but the frontend Axios client is hard-coded to port `5000`. For the frontend to reach the mock API, start json-server on port `5000` explicitly, or update the configuration as part of a deliberate change. There is no Vite proxy.

The mock package has only a placeholder failing `test` script:

```text
npm test          # exits with "Error: no test specified"
```

### Recommended validation

From `academiax-frontend`:

```powershell
npm run lint
npm run build
```

For manual integration checks, run the Express API on `5005` and json-server on `5000`, then start Vite. Verify course loading, student/admin login, enrollment, assignment submission/grading, notifications, and role redirects.

## 4. Frontend runtime architecture

The entry point is `academiax-frontend/src/main.jsx`.

```text
ChakraProvider theme={theme}
└── BrowserRouter
    └── AuthProvider
        └── CourseProvider
            └── EnrollmentProvider
                └── SubmissionProvider
                    └── NotificationProvider
                        └── App
```

`App.jsx` renders the same global shell around all routes:

```text
ScrollToTop
Navbar
main -> Routes
Footer
```

This includes public, student, and admin pages. `ScrollToTop` resets the scroll position when the location changes. Unknown paths render `NotFound`.

### Global contexts

`AuthContext` exposes:

```js
{
  user,
  isInitializing,
  login,
  register,
  logout
}
```

`CourseContext` exposes:

```js
{
  courses,
  loading,
  error,
  fetchCourses,
  addCourse,
  updateCourse,
  deleteCourse
}
```

`EnrollmentContext` exposes `enrollments`, `loading`, `enrollInCourse`, and `updateEnrollmentProgress`.

`SubmissionContext` exposes `submissions`, `loading`, `error`, `addSubmission`, and `gradeSubmission`.

`NotificationContext` exposes `notifications`, `loading`, `error`, and `markAsRead`.

## 5. Route map

Routes are declared in `academiax-frontend/src/App.jsx`.

### Public routes

| Path | Page | Purpose |
| --- | --- | --- |
| `/` | `Home` | Landing page |
| `/login` | `Login` | Student login |
| `/register` | `Register` | Student registration |
| `/courses` | `Courses` | Course catalog |
| `/courses/:id` | `CourseDetails` | Course details and enrollment |
| `/forgot-password` | `ForgotPassword` | Password-recovery UI |
| `/reset-password` | `ResetPassword` | Password-reset UI |
| `/admin/login` | `AdminLogin` | Admin login |
| `/admin/register` | `AdminRegister` | Admin registration UI |

### Protected student routes

Each route requires `ProtectedRoute requiredRole="student"`.

| Path | Page | Purpose |
| --- | --- | --- |
| `/dashboard` | `Dashboard` | Student dashboard |
| `/enrollment-success` | `EnrollmentSuccess` | Enrollment confirmation |
| `/learning/:courseId` | `CourseContent` | Course learning content |
| `/materials` | `CourseMaterials` | Course materials |
| `/learning/:courseId/video/:moduleId` | `VideoPlayer` | Module/video view |
| `/my-courses` | `MyCourses` | Enrolled course list |
| `/assignments` | `Assignments` | Submit assignments and view grades |
| `/notifications` | `Notifications` | Student notifications |
| `/certificate/:courseId` | `Certificate` | Certificate display |

### Protected admin routes

Each route requires `ProtectedRoute requiredRole="admin"`.

| Path | Page | Purpose |
| --- | --- | --- |
| `/admin/dashboard` | `AdminDashboard` | Faculty metrics and pending grading |
| `/admin/courses` | `AdminCourses` | Course CRUD list |
| `/admin/courses/new` | `CourseForm` | Create a course |
| `/admin/courses/:id/edit` | `CourseForm` | Edit a course |
| `/admin/courses/:id/roster` | `CourseRoster` | View/manage a course roster |
| `/admin/assignments` | `AdminAssignments` | Review and grade submissions |

## 6. Authentication and authorization

Relevant files are `src/context/AuthContext.jsx`, `src/services/api.js`, and `src/components/ProtectedRoute.jsx`.

### Session behavior

`AppState` stores the serialized user in `localStorage.user` and the fixed string `mock-jwt-token-12345` in `localStorage.token`. The token is not attached to requests and is only a local prototype marker.

On startup, `AuthProvider` restores a user only if the stored object has both `id` and `role`; otherwise it clears the session. `isInitializing` prevents protected-route decisions before this check completes.

### Login and registration

- `loginUser(email, password)` calls json-server `GET /users?email=<email>`.
- It compares the returned first user's plaintext password locally.
- Successful login stores the user and mock token.
- `AuthContext.login(email, password, expectedRole)` rejects a successful response when its role does not match the login screen's expected role.
- `registerUser(userData)` checks for an existing email with `GET /users`, then creates a user with `POST /users` and immediately starts a local session.

Seed accounts in `mock-api/db.json`:

```text
Student: student@email.com / password123
Admin:   test@academiax.edu / password123
```

There is also a seeded student account:

```text
Student: maneeshaca08@gmail.com / 123456
```

### Route guard behavior

- Unauthenticated users go to `/login` for student routes or `/admin/login` for admin routes.
- A non-admin attempting an admin route is sent to `/dashboard`.
- A non-student attempting a student route is sent to `/admin/dashboard`.
- Admin users cannot enroll through the course-details flow.

Passwords are plaintext in the mock database. This is not production authentication. Password recovery/reset screens are UI simulations and do not update a stored password.

## 7. API boundaries and persistence

### Shared json-server client

`src/services/api.js` creates an Axios client with:

```js
baseURL: "http://localhost:5000"
```

It is used by:

```text
AuthContext:
  GET /users?email=...
  GET /users?email=...       # duplicate-email check
  POST /users

EnrollmentContext:
  GET /enrollments?userId=...
  POST /enrollments
  PUT /enrollments/:id

SubmissionContext:
  GET /submissions?student=...
  GET /submissions
  POST /submissions
  PUT /submissions/:id

NotificationContext:
  GET /notifications?userId=...
  PUT /notifications/:id
```

These records are persisted by json-server in `mock-api/db.json` while that service is running.

### Express course client

`CourseContext.jsx` creates a separate Axios instance:

```js
baseURL: "http://localhost:5005"
```

It calls `/api/v1/courses` for initial loading and course CRUD. The Express service returns course arrays under `response.data.data`, and the context unwraps that field.

The Express course store is in memory, so it is independent of the `courses` collection in `mock-api/db.json`. The two stores currently contain different records and schemas.

### Current data-contract mismatch

The frontend accepts both `title` and `courseName` in several views. The Express seed data uses `title`; the mock database includes both:

- `fs202` and `6OqU1TM2-fw` use `courseName`/`courseCode` style fields.
- `cs101` uses `title` and includes modules.

The Express seed uses `fs202` and `ds301`, while the mock database uses `fs202`, `cs101`, and `6OqU1TM2-fw`. Course details and enrollment can therefore depend on which API supplies the course list, and IDs are not fully consistent across stores.

`CourseForm` sends the Express-required fields `title`, `category`, `instructor`, `description`, and `status`. Express validates `title`, `instructor`, `category`, and `description` only on POST.

## 8. Seed data

`mock-api/db.json` currently contains these collections:

- `users`: two original demo accounts plus the seeded `maneeshaca08@gmail.com` student.
- `courses`: three records with mixed field shapes (`title` versus `courseName`).
- `submissions`: four records, including pending and graded examples.
- `enrollments`: four records using mixed numeric/string `userId` values.
- `notifications`: two read notifications for user ID `1`.

The important record shapes are:

```json
{
  "user": {
    "id": "1",
    "name": "Jane Doe",
    "email": "student@email.com",
    "password": "password123",
    "role": "student"
  },
  "enrollment": {
    "userId": 1,
    "courseId": "fs202",
    "progress": 85,
    "status": "Ongoing"
  },
  "submission": {
    "student": "Jane Doe",
    "course": "Full Stack Development",
    "assignmentTitle": "Build a REST API",
    "status": "Pending",
    "content": "Submission text or URL",
    "grade": "",
    "feedback": ""
  },
  "notification": {
    "userId": 1,
    "message": "Your assignment has been graded.",
    "isRead": true
  }
}
```

`backend/data/courses.js` is a separate in-memory array containing:

- `fs202`: Full Stack Development
- `ds301`: Data Structures

## 9. Page and component responsibilities

### Shared components

- `Navbar.jsx`: sticky responsive navigation, role-specific links, and logout.
- `Footer.jsx`: global footer.
- `ProtectedRoute.jsx`: session initialization, authentication, and role checks.
- `ScrollToTop.jsx`: scroll reset on route changes.
- `CourseCard.jsx`: catalog card and link to course details.

### Context/service files

- `AuthContext.jsx`: session restoration, login, registration, and logout.
- `CourseContext.jsx`: Express-backed course loading and CRUD.
- `EnrollmentContext.jsx`: per-student enrollment loading, enrollment creation, and progress updates.
- `SubmissionContext.jsx`: student/admin submission loading, creation, and grading.
- `NotificationContext.jsx`: student notification loading and read-state updates.
- `api.js`: json-server Axios client and localStorage session helpers.

### Student pages

- `Home.jsx`: landing page.
- `Login.jsx`, `Register.jsx`: student account flows.
- `Dashboard.jsx`: student overview.
- `Courses.jsx`: Express-backed catalog; accepts both course naming schemas.
- `CourseDetails.jsx`: course information, modules, and json-server enrollment.
- `EnrollmentSuccess.jsx`: post-enrollment confirmation.
- `MyCourses.jsx`, `CourseContent.jsx`, `VideoPlayer.jsx`, `CourseMaterials.jsx`: learning/progress views.
- `Assignments.jsx`: submission form for enrolled courses and submission history.
- `Notifications.jsx`: notification list and read actions.
- `Certificate.jsx`: certificate display.
- `ForgotPassword.jsx`, `ResetPassword.jsx`: non-persistent recovery/reset UI.

### Admin pages

- `AdminLogin.jsx`, `AdminRegister.jsx`: admin account screens.
- `AdminDashboard.jsx`: combines Express course count, json-server enrollment count, and json-server pending submissions.
- `AdminCourses.jsx`: Express-backed course list and deletion.
- `CourseForm.jsx`: Express-backed create/edit form.
- `CourseRoster.jsx`: roster view/drop-student UI.
- `AdminAssignments.jsx`: json-server submission review and grading modal.

## 10. Known limitations and inconsistencies

- The frontend has no environment-based API URLs; both service URLs are hard-coded.
- `mock-api/package.json` starts json-server on `5002`, but frontend requests port `5000`.
- The Express backend and json-server both have a courses collection, but the frontend course context uses only Express.
- Express course data is in memory and disappears on restart.
- Course records use inconsistent names and IDs across the two stores.
- The mock token is neither generated nor sent to an API.
- Passwords are stored and compared in plaintext.
- Registration persists through json-server, but password reset does not.
- Enrollment, submissions, and notifications have no backend authorization checks.
- Several pages use browser `alert`/`confirm` for feedback.
- Loading and error handling is implemented in contexts/pages, but not every action exposes a detailed error to the user.
- No automated unit, integration, or end-to-end tests are configured.
- The root `README.md` is still the default Vite template and is not product documentation.

Do not describe the current implementation as a production backend, secure authentication system, or fully unified persistence layer.

## 11. Guidance for future changes

1. Locate the owning route, page, context, or service before editing.
2. Preserve the existing JavaScript/JSX and Chakra UI patterns.
3. Use the existing `api.js` client for json-server resources and the existing `expressApi` in `CourseContext` for Express course resources unless the task explicitly unifies them.
4. Keep public paths, protected-role behavior, and seeded IDs stable unless a migration is intentional.
5. Normalize course fields at a clear boundary instead of spreading additional schema fallbacks across pages.
6. Keep loading, empty, and error states visible.
7. Do not add security claims to this prototype; document any new persistence or authorization behavior.
8. Avoid unrelated CSS rewrites, generated output, dependency folders, or API migrations.
9. Do not commit `dist` output or installed dependency directories.

## 12. Definition of done

For a normal feature or bug fix:

- The owning component/context/service is changed.
- Existing public routes and role guards still work.
- The correct local API and response shape are used.
- Relevant loading, empty, and error states are preserved.
- `npm run lint` passes.
- `npm run build` passes.
- Manual API-dependent behavior is checked with Express on `5005` and json-server on `5000`.
- Related data-contract or persistence changes are reflected in this document.
