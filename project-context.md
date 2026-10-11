# AcademiaX Project Context

This document is the working context for coding agents modifying this repository. It describes the current implementation as it exists in the workspace, including prototype behavior and known inconsistencies. Treat the source code as authoritative when this document and the implementation disagree, and update this document when a significant architectural change is completed.

## 1. Project Identity

- Product name: AcademiaX
- Product type: React single-page course management and e-learning application
- Repository root: `course_management_system_react`
- Frontend directory: `academiax-frontend`
- Mock backend directory: `mock-api`
- Primary users: students and faculty administrators
- Current maturity: functional prototype / coursework project, not production-ready
- Language: JavaScript and JSX using ES modules in the frontend
- Backend: local `json-server` database with a small REST API

The application is intended to cover two related experiences:

1. Student experience: browse courses, enroll, view learning content, submit assignments, see notifications, and obtain certificates.
2. Admin/faculty experience: view dashboard metrics, manage courses, inspect rosters, and review assignments.

The implementation is hybrid. Authentication and the course catalog are partially connected to the mock API. Many other screens are visually complete prototypes backed by hard-coded data or component-local state. Do not assume that a visible action is persisted merely because it looks like a real workflow.

## 2. Workspace Layout

```text
course_management_system_react/
├── project-context.md             # This agent context document
├── academiax-frontend/            # Vite React application
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── index.html
│   ├── README.md                  # Default Vite README; not product documentation
│   ├── public/
│   ├── dist/                      # Generated build output; ignored by ESLint
│   └── src/
│       ├── App.jsx                # Route table and shared shell
│       ├── main.jsx               # React root and provider tree
│       ├── index.css              # Global CSS imported by the entry point if applicable
│       ├── theme.js               # Custom Chakra theme wired into ChakraProvider in main.jsx
│       ├── assets/
│       ├── components/            # Shared UI and routing components
│       ├── context/               # Auth and course state providers
│       ├── pages/                 # Route-level screens
│       ├── services/              # Axios client and session helpers
│       └── styles/                # Legacy CSS files; generally not imported
└── mock-api/
    ├── db.json                    # Seed data for json-server
    └── package.json
```

## 3. Technology and Commands

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
npm run dev       # Start Vite development server
npm run build     # Build production assets
npm run lint      # Run ESLint
npm run preview   # Serve the production build locally
```

There is no configured frontend test runner or test script. There are currently no unit, integration, or end-to-end tests in the repository.

### Mock API setup

Run from `mock-api` in a second terminal:

```powershell
npm install
npx json-server --watch db.json --port 5000
```

The frontend Axios client is hard-coded to `http://localhost:5000`. The API must be running for login and course loading to work. There is no Vite proxy configured in `vite.config.js`, and `mock-api/package.json` has only a placeholder failing `test` script.

### Recommended validation sequence

```powershell
cd c:\Users\manee\Documents\course_management_system_react\academiax-frontend
npm run lint
npm run build
```

For behavior checks, start the mock API, then start Vite and manually verify:

1. `/courses` loads with API data.
2. Student login works with the seed credentials.
3. Admin login works with the seed credentials.
4. Admin-only routes reject a student.
5. Logout clears the session and navigates to `/login`.
6. Course detail links use valid course IDs.
7. Production preview loads after `npm run build`.

## 4. Runtime Architecture

The application entry point is `academiax-frontend/src/main.jsx`.

Actual provider tree in the live app:

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

`App.jsx` renders the shared shell around every route:

```text
ScrollToTop
Navbar
main -> Routes -> route page
Footer
```

This means the navbar and footer are part of the global layout for all pages, including auth and admin views. `ScrollToTop` resets scroll position whenever the route changes.

### State ownership

Authentication state is global in `AuthContext` and exposes the following values:

```js
{
  (user, isInitializing, login, register, logout);
}
```

Course state is global in `CourseContext` and exposes:

```js
{
  (courses,
    loading,
    error,
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse);
}
```

The app also keeps additional feature state in: `EnrollmentContext`, `SubmissionContext`, and `NotificationContext`.

## 5. Routing Map

Routes are declared centrally in `academiax-frontend/src/App.jsx`.

### Public routes

| Path               | Page             | Current purpose               |
| ------------------ | ---------------- | ----------------------------- |
| `/`                | `Home`           | Landing/home experience       |
| `/login`           | `Login`          | Student login form            |
| `/register`        | `Register`       | Student registration UI       |
| `/courses`         | `Courses`        | Course catalog                |
| `/courses/:id`     | `CourseDetails`  | Course detail view            |
| `/forgot-password` | `ForgotPassword` | Password recovery simulation  |
| `/reset-password`  | `ResetPassword`  | Password reset simulation     |
| `/admin/login`     | `AdminLogin`     | Admin login form              |
| `/admin/register`  | `AdminRegister`  | Admin registration simulation |

### Protected student routes

All student routes below are wrapped in `ProtectedRoute requiredRole="student"`:

| Path                                  | Page                | Current purpose         |
| ------------------------------------- | ------------------- | ----------------------- |
| `/dashboard`                          | `Dashboard`         | Student dashboard       |
| `/enrollment-success`                 | `EnrollmentSuccess` | Enrollment confirmation |
| `/learning/:courseId`                 | `CourseContent`     | Learning content        |
| `/materials`                          | `CourseMaterials`   | Course materials        |
| `/learning/:courseId/video/:moduleId` | `VideoPlayer`       | Video/module view       |
| `/my-courses`                         | `MyCourses`         | Student course list     |
| `/assignments`                        | `Assignments`       | Student assignment UI   |
| `/notifications`                      | `Notifications`     | Student notifications   |
| `/certificate/:courseId`              | `Certificate`       | Certificate display     |

### Protected admin routes

All admin routes below are wrapped in `ProtectedRoute requiredRole="admin"`:

| Path                        | Page               | Current purpose        |
| --------------------------- | ------------------ | ---------------------- |
| `/admin/dashboard`          | `AdminDashboard`   | Faculty/admin overview |
| `/admin/courses`            | `AdminCourses`     | Course management      |
| `/admin/courses/new`        | `CourseForm`       | New course creation    |
| `/admin/courses/:id/edit`   | `CourseForm`       | Edit course            |
| `/admin/courses/:id/roster` | `CourseRoster`     | Course roster review   |
| `/admin/assignments`        | `AdminAssignments` | Assignment grading     |

There is an explicit catch-all route:

```jsx
<Route path="*" element={<NotFound />} />
```

So unmatched paths render the `NotFound` page instead of silently showing only the shell.

## 6. Authentication and Authorization

Relevant files:

- `src/context/AuthContext.jsx`
- `src/services/api.js`
- `src/components/ProtectedRoute.jsx`
- `src/pages/Login.jsx`
- `src/pages/AdminLogin.jsx`
- `src/components/Navbar.jsx`

### Session model

`api.js` exposes `AppState` helpers using browser `localStorage`:

- `user`: serialized user object
- `token`: fixed string `mock-jwt-token-12345`

The token is mock-only and is not attached to real Axios requests. It is used as a lightweight local session marker for the front-end prototype only.

On startup, `AuthContext` restores the saved user and sets `isInitializing` false once the check finishes. `ProtectedRoute` waits while initialization is running and then validates access.

### Login flow

1. The login page calls `login(email, password, expectedRole)` from `AuthContext`.
2. `AuthContext` calls `loginUser` in `services/api.js`.
3. `loginUser` queries the mock API:

```text
GET http://localhost:5000/users?email=<email>
```

4. The returned user is checked against the submitted password.
5. If the role matches the expected role, the user is saved to local storage and React auth state.
6. The app redirects to the correct dashboard or route after success.

### Role enforcement

The live implementation does enforce the role argument.

```js
if (expectedRole && response.user.role !== expectedRole) {
  AppState.clearSession();
  return {
    success: false,
    message: "This account does not have access to this login.",
  };
}
```

This is used by both student and admin login forms.

### Seed credentials

Student:

```text
email: student@email.com
password: password123
role: student
```

Admin:

```text
email: test@academiax.edu
password: password123
role: admin
```

### Guard behavior

- No valid user: redirect to the relevant login page.
- `requiredRole="admin"` and non-admin user: redirect to `/dashboard`.
- `requiredRole="student"` and non-student user: redirect to `/admin/dashboard`.
- A student cannot access an admin protected route.
- The route guard is the real source of enforcement; the login screen is also role-aware.

### Important auth caveats

- Passwords are stored in plaintext in `db.json` for this mock environment.
- Registration and password-reset screens do not yet create or update real user records in the backend.
- This is still a frontend prototype, not a production authentication system.

## 7. API and Persistence

The Axios instance in `src/services/api.js` is the shared API client:

```js
baseURL: "http://localhost:5000";
```

### Implemented client operations

`AuthContext` / `api.js`:

```text
GET /users?email=<email>
POST /users
```

`CourseContext`:

```text
GET    /courses
POST   /courses
PUT    /courses/:id
DELETE /courses/:id
```

Additional contexts implement their own mock-backed data flows:

- `EnrollmentContext` uses `/enrollments`
- `SubmissionContext` uses `/submissions`
- `NotificationContext` uses `/notifications`

### Effective persistence boundary

API-backed today:

- User lookup during login
- Course catalog loading and CRUD
- Enrollment records and progress mutation
- Submission fetch/add/grade operations
- Notification fetch and read-state updates

Still mock or UI-only in practice:

- registration as a real persisted account flow
- password recovery/reset persistence
- certificate generation data
- progress completion beyond the current context flow
- any workflow that relies on unimplemented server-side validation

## 8. Seed Data Contracts

The source of truth for mock data is `mock-api/db.json`.

### Users

```json
{
  "id": "1",
  "name": "Jane Doe",
  "email": "student@email.com",
  "password": "password123",
  "role": "student"
}
```

### Courses

```json
{
  "id": "fs202",
  "title": "Full Stack Development",
  "category": "Engineering",
  "instructor": "Prof. Alan Turing",
  "status": "Active",
  "totalEnrolled": 142,
  "description": "Learn to build modern web applications from frontend to backend.",
  "modules": [
    {
      "id": "m1",
      "title": "HTML & CSS Fundamentals",
      "duration": "2 weeks"
    }
  ]
}
```

### Submissions

```json
{
  "id": "1",
  "student": "Jane Doe",
  "course": "Full Stack Development",
  "assignmentTitle": "Build a REST API",
  "date": "Oct 14, 2026",
  "status": "Pending",
  "content": "Submission text or URL",
  "grade": "",
  "feedback": ""
}
```

### Enrollments

```json
{
  "id": "1",
  "userId": 1,
  "courseId": "fs202",
  "progress": 85,
  "status": "Ongoing"
}
```

### Notifications

```json
{
  "id": "1",
  "userId": 1,
  "message": "Your assignment 'Variables & Loops' has been graded.",
  "isRead": true,
  "date": "2026-09-10T10:00:00Z"
}
```

The app expects `name`, `title`, `description`, and `category` to be present on the relevant records. The code uses fallback values when older or partial records are encountered.

## 9. Page and Component Responsibilities

### Shared components

- `Navbar.jsx`: sticky global navigation, responsive menu, role-dependent links, and logout handling.
- `Footer.jsx`: global footer.
- `ProtectedRoute.jsx`: authentication and role guard.
- `ScrollToTop.jsx`: route-based scroll reset.
- `CourseCard.jsx`: card component for catalog rows using `id`, `title`, `description`, `category`, and `imageUrl`.

### Context and service files

- `AuthContext.jsx`: restores session state, exposes login/register/logout, and validates expected roles.
- `CourseContext.jsx`: fetches and mutates course data with CRUD actions.
- `EnrollmentContext.jsx`: loads per-student enrollments and supports enrollment/progress updates.
- `SubmissionContext.jsx`: loads submissions and grades them.
- `NotificationContext.jsx`: loads notifications and marks them as read.
- `api.js`: shared Axios instance plus localStorage session helpers.

### Student pages

- `Home.jsx`: landing page.
- `Login.jsx`: student login.
- `Register.jsx`: student registration form.
- `Dashboard.jsx`: student dashboard.
- `Courses.jsx`: course catalog page backed by `useCourses`.
- `CourseDetails.jsx`: course detail page with enrollment action.
- `EnrollmentSuccess.jsx`: enrollment confirmation page.
- `MyCourses.jsx`: student course progression view.
- `CourseContent.jsx`: learning roadmap and module progression.
- `VideoPlayer.jsx`: module/video player screen.
- `CourseMaterials.jsx`: materials view.
- `Assignments.jsx`: student assignment submission UI.
- `Notifications.jsx`: notification list.
- `Certificate.jsx`: certificate display.
- `ForgotPassword.jsx`: mock password recovery flow.
- `ResetPassword.jsx`: mock password reset flow.

### Admin pages

- `AdminLogin.jsx`: admin login form.
- `AdminRegister.jsx`: simulated faculty registration.
- `AdminDashboard.jsx`: metrics and pending-grading summary.
- `AdminCourses.jsx`: admin course list and delete flow.
- `CourseForm.jsx`: add/edit course form with normalized course payloads.
- `CourseRoster.jsx`: course roster display and drop student flow.
- `AdminAssignments.jsx`: review and grade student submissions.

## 10. Current Project Reality

The app is a functional mock-driven prototype, not a production authentication or content platform.

### What is implemented well

- role-aware login and route protection
- course catalog fetching and CRUD through the mock API
- enrollment and progress tracking for students
- assignment review and grading via the mock data layer
- notification and dashboard flows

### Important constraints

- localStorage is used for session persistence
- mock API data is plain JSON, not a hardened backend
- some flows are still prototype-level UI and may not represent full persistence
- no automated tests are configured in the repo
- the app is intentionally designed around the mock API rather than a production authentication contract

Do not describe these as backend functionality in UI copy or documentation until they are wired to API operations.

## 11. Coding Guidance for Agents

1. Start by locating the owning component/context for the requested behavior. The route file often only wires a page; the actual decision is usually in the page, context, or `api.js`.
2. Preserve the existing JavaScript/JSX style unless the task explicitly requests migration.
3. Prefer Chakra UI components and style props for new UI because that is the active implementation style.
4. Reuse `AuthContext`, `CourseContext`, and the shared Axios instance instead of duplicating state or HTTP setup.
5. Keep public route paths and seeded IDs stable unless the requested feature requires a route/data migration.
6. Normalize data at a clear boundary. Do not make every consumer support multiple spellings for the same field.
7. Keep API failures visible through existing loading/error patterns. Avoid silently substituting unrelated mock data for failed requests.
8. Remember that local component state is intentionally common in the prototype, but document or test any new persistence boundary.
9. Avoid adding real security claims. The current local auth is a demo mechanism only.
10. Keep edits focused. Do not rewrite the legacy CSS directory or migrate all pages to an API unless the task explicitly requires that scope.
11. Use descriptive variable names and follow the existing React hooks patterns.
12. Do not commit generated `dist` output or dependency folders.

## 12. Suggested Priorities for Future Work

When several improvements are possible, this order reduces the most user-visible inconsistency first:

1. Repair the course catalog data contract between `Courses`, `CourseCard`, and `db.json`.
2. Unify course detail data with the API course model and correct `ds300`/`ds301`.
3. Wire the custom Chakra theme intentionally or remove/update the inactive theme file.
4. Normalize the user display field (`name` versus `username`) and enforce role-specific login semantics.
5. Protect authenticated student routes consistently.
6. Move enrollment, submissions, notifications, and progress to API-backed services/contexts.
7. Connect admin course forms to the already-existing `CourseContext` CRUD methods.
8. Add route-level loading/error/empty states and a 404 route.
9. Add focused tests around auth guards, catalog rendering, and course CRUD before broad UI refactors.

## 13. Definition of Done for Changes

For a normal feature or bug fix, an agent should be able to answer yes to the following:

- The change is made in the component/context/service that owns the behavior.
- Existing routes and role guards still behave as intended.
- API-backed behavior uses the shared Axios client and the correct `db.json` field names.
- Loading, empty, and error states are handled where the request can fail.
- `npm run lint` passes.
- `npm run build` passes.
- Any workflow that depends on port 5000 has been checked with the mock API running.
- New persistence or data-contract changes are reflected in this document.
- No unrelated legacy CSS or generated output was changed without a reason.

## 14. Quick Reference

```text
Frontend: c:\Users\manee\Documents\course_management_system_react\academiax-frontend
Mock API: c:\Users\manee\Documents\course_management_system_react\mock-api
API URL:  http://localhost:5000
Dev URL:  usually http://localhost:5173

Student: student@email.com / password123
Admin:   test@academiax.edu / password123

Primary entry:     academiax-frontend/src/main.jsx
Route table:       academiax-frontend/src/App.jsx
Auth state:        academiax-frontend/src/context/AuthContext.jsx
Course state:      academiax-frontend/src/context/CourseContext.jsx
HTTP/session:      academiax-frontend/src/services/api.js
API seed data:     mock-api/db.json
Route guard:       academiax-frontend/src/components/ProtectedRoute.jsx
```
