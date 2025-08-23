# Kanban Board Application

The company wants to have a kanban board application that can show the work status of several team
members from different departments. Each task updated by the user can be depicted on the board, with
the changes persistent even though the browser is refreshed, the data remains consistent with its last position.

## USER STORIES:

1. Users must log in using their respective usernames and passwords to be able to enter and use
   the kanban app. The login page, at mobile view will be a single form consist of Username and Password field which located in the center of the screen. At the desktop view (viewport md), the screen will be devided into two section, they have same width, the left one will be the background color black and the right one is the login form. The login page will have /login address. This is the login api:

- path: /api/auth/login
- method: post
- payload:
  {
  "password": "string",
  "username": "string"
  }
- success response:
  {
  "data": {
  "token": "string",
  "user": {
  "created_at": "2025-08-23T12:25:40.241Z",
  "id": 1073741824,
  "name": "string",
  "updated_at": "2025-08-23T12:25:40.241Z",
  "username": "string"
  }
  },
  "message": "string",
  "status": "string"
  }
- when success, store the data.token to cookie. This token will be inserted to request header Authorization bearer for all the xhr request inside the dashboard. Store the data.user to react context that wrap the dashboard.
- There will be middleware that check token in cookie. If there is no token, will be directed to /login.
- There should be axios interceptor which append header Authorization bearer if there token existed and redirect to login page each time received 401 error from backend.

2. Users can see their names mentioned on the dashboard as a sign that they have successfully
   logged in. User names taken from context.
3. Users can see on the dashboard, a kanban board with 3 columns that have been defined: TO DO,
   DOING, DONE. From the backend side, there will be the a column, named: status, on the Task type which is enum. TO_DO is for TO DO, DOING is for DOING and DONE is for DONE. The dashboard page will have /dashboard address. This is protected page, only logged in users can visit this page. Non login user will be redirected to /login page.
4. Users can see the task cards on the board (if any). Here is the detail for get tasks api:

- path: /api/tasks
- method: get
- success response:
  {
  "data": [
  {
  "attachments": [
  {
  "name": "string",
  "url": "string"
  }
  ],
  "created_at": "2025-08-23T13:26:46.790Z",
  "created_by": 1073741824,
  "description": "string",
  "external_link": "string",
  "id": 1073741824,
  "name": "string",
  "status": "TO_DO" | "DOING" | "DONE",
  "teams": [
  "string"
  ],
  "updated_at": "2025-08-23T13:26:46.790Z"
  }
  ],
  "message": "string",
  "status": "string"
  }

5. Users can create new tasks from the dashboard with the available button. The button label is: "Add a task". When it clicked. There will be a Dialog which title is "Add a Task".
6. Users can see the form for creating new tasks that contains the following fields:

- task name (text input -mandatory)
- task description (textarea)
- team selection that the task is assigned to, consisting of DESIGN, BACKEND, FRONTEND. Use checkbox here, so user can select none of them or multiple items.
- task status when created (dropdown, select one: TO_DO, DOING, DONE)

7. A task can be assigned not to any team, but can also be assigned to more than 1 team.
8. Mandatory task name
9. When a task is successfully created, the task will appear in the form of a card on the kanban
   board with a column position according to the task status. Here is the detail for insert task api:

- path: /api/tasks
- method: post
- request body:
  {
  "description": "string",
  "external_link": "string",
  "name": "string",
  "status": "TO_DO" | "DOING" | "DONE",
  "teams": [
  "FRONTEND",
  "BACKEND",
  ]
  }
- success response:
  {
  "data": {
  "attachments": [
  {
  "name": "string",
  "url": "string"
  }
  ],
  "created_at": "2025-08-23T13:38:32.231Z",
  "created_by": 1073741824,
  "description": "string",
  "external_link": "string",
  "id": 1073741824,
  "name": "string",
  "status": "string",
  "teams": [
  "string"
  ],
  "updated_at": "2025-08-23T13:38:32.231Z"
  },
  "message": "string",
  "status": "string"
  }

10. Users can see the details of a task in its respective detail page by clicking the task title in its card. The task detail page address is /dashboard/[taskId]. The detail task api is:

- path: /api/tasks/{id}
- method: get
- success response:
  {
  "data": {
  "attachments": [
  {
  "name": "string",
  "url": "string"
  }
  ],
  "created_at": "2025-08-23T13:45:22.692Z",
  "created_by": 1073741824,
  "description": "string",
  "external_link": "string",
  "id": 1073741824,
  "name": "string",
  "status": "string",
  "teams": [
  "string"
  ],
  "updated_at": "2025-08-23T13:45:22.692Z"
  },
  "message": "string",
  "status": "string"
  }
  This detail task will have breadcrumb: Dashboard > [Task Name].
  There will be Edit Task and Delete buttons.
  It will be a card with task name as title. Below the title will be task description. Below description will be team which assigned to the task. Below the team will be the status of task. Last, show the info which consist created at and updated at datetime with the format example: 1 February 2024 07:20AM.

11. Users can see when the task was created and when it was last updated on the detail page. When
    a task is first created, the same date is the date the task was updated.
12. Users can edit the details of a task from its detail page. The url for edit page is /dashboard/[taskId]/edit. Fetch the task data by its id first then set as initial value. Here is the update task api detail:

- path: /api/tasks/{id}
- method: put
- request body:
  {
  "description": "string",
  "external_link": "string",
  "name": "string",
  "status": "string",
  "teams": [
  "string"
  ]
  }
- success response:
  {
  "data": {
  "attachments": [
  {
  "name": "string",
  "url": "string"
  }
  ],
  "created_at": "2025-08-23T13:55:55.540Z",
  "created_by": 1073741824,
  "description": "string",
  "external_link": "string",
  "id": 1073741824,
  "name": "string",
  "status": "string",
  "teams": [
  "string"
  ],
  "updated_at": "2025-08-23T13:55:55.540Z"
  },
  "message": "string",
  "status": "string"
  }

13. Users can delete a task from the detail page.
14. Users are faced with a confirmation modal before the delete process is carried out. Here is the delete task api detail:

- path: /api/tasks/{id}
- method: delete
- success response:
  {
  "data": true,
  "message": "string",
  "status": "string"
  }

15. Users return to the kanban board dashboard after a task is successfully deleted with a
    notification appearing stating that the task was successfully deleted.
16. Users can log out and will be taken back to the login page. Here is the logout api detail:

- path: /api/auth/logout
- method: post
- success response:
  {
  "data": true,
  "message": "string",
  "status": "string"
  }

17. Users can still see task data in their respective status columns even though the browser is
    refreshed and after logging out then logging back in. On the middleware level, when the token existed in cookie, it will continue to process the context provider level and detect if token exist and user context is undefined then it will fetch the user data before loading the dashboard. Here is the detail of get current user information:

- path: /api/auth/me
- method: get

## Tech Stack

1. Nextjs (App Router)
2. Tailwind css
3. Schadcn-ui
4. React query (@tanstack/react-query)
5. Axios
6. date-fns
7. sonner
8. zod + react-hook-form + @hookform/resolvers

## Development Guide

- Use yarn instead of npm
- The backend service url will be stored on .env (NEXT_PUBLIC_API_URL)
