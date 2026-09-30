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
│       ├── theme.js               # Custom Chakra theme; currently not wired into main.jsx
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

Provider tree:

```text
ChakraProvider
└── BrowserRouter
    └── AuthProvider
        └── CourseProvider
            └── App
```

`App.jsx` renders the shared shell around every route:

```text
ScrollToTop
Navbar
main -> Routes -> route page
Footer
```

This means the navbar and footer appear even on authentication and admin pages unless a future change alters the shell. `ScrollToTop` reacts to location changes and resets scroll position.

### State ownership

Authentication state is global in `AuthContext`:

```js
{
  (user, isInitializing, login, logout);
}
```

Course catalog state is global in `CourseContext`:

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

Most other state is local to individual pages. Refreshing the browser normally loses changes made in these pages because they are not sent to the API or persisted to local storage.

## 5. Routing Map

Routes are declared centrally in `academiax-frontend/src/App.jsx`.

### Public routes

| Path                                  | Page                | Current purpose                                      |
| ------------------------------------- | ------------------- | ---------------------------------------------------- |
| `/`                                   | `Home`              | Landing/home experience                              |
| `/login`                              | `Login`             | Student login form                                   |
| `/register`                           | `Register`          | Student registration UI; does not create an API user |
| `/courses`                            | `Courses`           | Course catalog, intended to use `CourseContext`      |
| `/courses/:id`                        | `CourseDetails`     | Course details from an in-component mock database    |
| `/enrollment-success`                 | `EnrollmentSuccess` | Enrollment confirmation; reads `id` query parameter  |
| `/dashboard`                          | `Dashboard`         | Student dashboard, wrapped in `ProtectedRoute`       |
| `/learning/:courseId`                 | `CourseContent`     | Course roadmap and learning content                  |
| `/learning/:courseId/video/:moduleId` | `VideoPlayer`       | Module/video view                                    |
| `/materials`                          | `CourseMaterials`   | Materials view; reads `course` query parameter       |
| `/my-courses`                         | `MyCourses`         | Student course list and progress                     |
| `/assignments`                        | `Assignments`       | Student assignment submission UI                     |
| `/notifications`                      | `Notifications`     | Student notification UI                              |
| `/certificate/:courseId`              | `Certificate`       | Certificate display/print UI                         |
| `/forgot-password`                    | `ForgotPassword`    | Password recovery simulation                         |
| `/reset-password`                     | `ResetPassword`     | Password reset simulation                            |

### Admin routes

All admin routes below use `ProtectedRoute requiredRole="admin"`:

| Path                        | Page               | Current purpose                    |
| --------------------------- | ------------------ | ---------------------------------- |
| `/admin/login`              | `AdminLogin`       | Admin login form                   |
| `/admin/register`           | `AdminRegister`    | Admin registration simulation      |
| `/admin/dashboard`          | `AdminDashboard`   | Faculty/admin metrics and activity |
| `/admin/courses`            | `AdminCourses`     | Admin course listing and actions   |
| `/admin/courses/new`        | `CourseForm`       | Course creation form               |
| `/admin/courses/:id/edit`   | `CourseForm`       | Course edit form                   |
| `/admin/courses/:id/roster` | `CourseRoster`     | Course roster view                 |
| `/admin/assignments`        | `AdminAssignments` | Assignment review and grading      |

There is no explicit catch-all or 404 route. An unmatched path renders the shared shell with no route content.

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

The token is not real, is never attached to Axios requests, and is not validated by the mock API.

On application initialization, `AuthContext` reads the stored user once. During this period `isInitializing` is true. `ProtectedRoute` shows a loading spinner/message until initialization completes.

### Login flow

1. A login page calls `login(email, password)` from `AuthContext`.
2. `AuthContext` calls `loginUser` in `services/api.js`.
3. `loginUser` performs:

```text
GET http://localhost:5000/users?email=<email>&password=<password>
```

4. The first returned user is saved to local storage and React auth state.
5. The login page navigates after a successful response.

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

- No user: redirect to `/login`.
- `requiredRole="admin"` and non-admin user: redirect to `/dashboard`.
- A student can access the admin login form, but cannot pass the admin route guard.
- The `role` argument passed by some login pages is not used by `AuthContext.login`.
- Student-facing routes such as `/my-courses`, `/assignments`, `/notifications`, and `/certificate/:courseId` are currently not protected even though their names imply authenticated access.

### Important auth caveats

- Passwords are stored in plaintext in `db.json` and sent in URL query parameters. This is acceptable only for this local mock and must not be copied into a production design.
- Registration screens do not create users in the API.
- Password recovery/reset screens do not read or update user records.
- `Navbar.jsx` displays `user.username`, but seeded users provide `name`; the user display may therefore be blank for students.
- Admin and student login pages should be checked before changing role-specific navigation because the current role-selection contract is incomplete.

## 7. API and Persistence

The Axios instance in `src/services/api.js` is the single shared API client:

```js
baseURL: "http://localhost:5000";
```

### Implemented client operations

`AuthContext` / `api.js`:

```text
GET /users?email=<email>&password=<password>
```

`CourseContext`:

```text
GET    /courses
POST   /courses
PUT    /courses/:id
DELETE /courses/:id
```

No request interceptor, token header, environment-based API URL, or centralized error-normalization layer exists.

### Effective persistence boundary

API-backed today:

- User lookup during login
- Course catalog loading
- Course CRUD functions exposed by `CourseContext`

Not currently API-backed despite collections existing in `db.json`:

- Enrollments
- Assignment submissions
- Notifications
- Roster membership
- User registration
- Password changes
- Course progress
- Module completion
- Certificate data
- Admin grading changes

When implementing one of these workflows, preserve the existing Axios client and add the smallest appropriate service/context boundary rather than scattering raw requests across unrelated components.

## 8. Seed Data Contracts

The source of truth for mock data is `mock-api/db.json`.

### Users

```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "student@email.com",
  "password": "password123",
  "role": "student"
}
```

Roles currently used: `student` and `admin`.

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

Seed course IDs:

- `fs202` - Full Stack Development
- `ds301` - Data Structures
- `cs101` - Intro to Computer Science

### Submissions

```json
{
  "id": 1,
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
  "id": 1,
  "userId": 1,
  "courseId": "fs202",
  "progress": 85,
  "status": "Ongoing"
}
```

### Notifications

```json
{
  "id": 1,
  "userId": 1,
  "message": "Your assignment 'Variables & Loops' has been graded.",
  "isRead": false,
  "date": "2026-09-10T10:00:00Z"
}
```

The API data uses `name`, `title`, `description`, and `category`. Do not introduce aliases such as `username`, `courseName`, or `overview` without a deliberate normalization layer.

## 9. Page and Component Responsibilities

### Shared components

- `Navbar.jsx`: sticky global navigation, responsive collapse menu, role-dependent links, logout action. Uses `AuthContext`.
- `Footer.jsx`: global footer.
- `ProtectedRoute.jsx`: authentication and optional admin-role guard. Uses `AuthContext`.
- `ScrollToTop.jsx`: scroll reset on route changes.
- `CourseCard.jsx`: Chakra card that expects props `id`, `title`, `description`, `category`, and optional `imageUrl`; links to `/courses/:id`.

### Context and service files

- `AuthContext.jsx`: reads/restores session, delegates login/logout, exposes auth state.
- `CourseContext.jsx`: fetches and mutates `/courses`; maintains loading/error state.
- `api.js`: Axios instance plus local-storage session helpers and login request.

### Student pages

- `Home.jsx`: home experience.
- `Login.jsx`: student login.
- `Register.jsx`: registration-like UI; no user creation.
- `Dashboard.jsx`: student dashboard; uses auth user and local dashboard data.
- `Courses.jsx`: catalog view; intended to consume `useCourses`.
- `CourseDetails.jsx`: uses a local mock database, not `CourseContext`.
- `EnrollmentSuccess.jsx`: confirmation page; navigation only, no enrollment mutation.
- `MyCourses.jsx`: local course enrollment/progress presentation.
- `CourseContent.jsx`: local roadmap and module completion state.
- `VideoPlayer.jsx`: local video/module completion state.
- `CourseMaterials.jsx`: local materials data and disabled download actions.
- `Assignments.jsx`: local assignment selection and submission status.
- `Notifications.jsx`: local notification list and read state.
- `Certificate.jsx`: local certificate data and browser print flow.
- `ForgotPassword.jsx`: recovery simulation.
- `ResetPassword.jsx`: reset simulation.

### Admin pages

- `AdminLogin.jsx`: admin login UI; still uses shared auth lookup.
- `AdminRegister.jsx`: simulated admin registration/login flow.
- `AdminDashboard.jsx`: local metrics and activity data.
- `AdminCourses.jsx`: local course list and admin actions; does not currently use `CourseContext`.
- `CourseForm.jsx`: local form state, module add/remove UI, console logging on submit; does not call course CRUD functions.
- `CourseRoster.jsx`: local roster; removal is not persisted.
- `AdminAssignments.jsx`: local submission review and grading; changes are not persisted.

## 10. Known Contract Mismatches and Defects

These are current facts to check before treating a workflow as complete.

### Catalog prop mismatch

`CourseContext` receives API courses shaped like:

```text
{ id, title, description, category, ... }
```

`Courses.jsx` currently passes these legacy fields to `CourseCard`:

```text
image, courseName, overview, courseKey
```

`CourseCard.jsx` expects:

```text
id, title, description, category, imageUrl
```

Consequences include missing card text and links such as `/courses/undefined`. This is a high-priority integration defect. Fix the contract at the narrowest boundary, then run lint/build and verify `/courses` manually.

### Duplicate and divergent course sources

`CourseDetails.jsx` has a separate hard-coded database. It differs from `db.json` in instructor, category, duration, descriptions, and modules. It also uses `ds300`, while the API seed course is `ds301`.

Other learning pages contain additional local course/progress data. Before unifying these screens, decide whether API data or a normalized frontend model is the source of truth.

### Theme is inactive

`theme.js` defines a dark Chakra theme with a teal `brand` palette, typography, global styles, and component defaults. However, `main.jsx` currently renders `<ChakraProvider>` without importing or passing the custom theme:

```jsx
<ChakraProvider>
```

Do not assume the settings in `theme.js` are active. A future theme change requires wiring the theme into `ChakraProvider` and checking for visual regressions.

### Styling is mixed/legacy

The active code primarily uses Chakra components and style props. `src/styles/` contains older CSS files with legacy selectors and Bootstrap-like class names. Most of those files are not imported. `Courses.jsx` still uses `container`, `row`, and `col-md-*` class names even though no Bootstrap dependency is declared, so those classes should not be assumed to style anything.

`index.css` contains global body/selection styles and imports Inter from Google Fonts. Verify actual imports before editing styling infrastructure.

### Prototype actions are not persistence

The following interactions currently update only local state or navigate:

- Enroll Now
- Registration
- Password reset
- Mark module/video complete
- Submit assignment
- Grade assignment
- Mark notification read
- Download course materials
- Remove roster member
- Add/edit/delete admin course through admin screens

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
