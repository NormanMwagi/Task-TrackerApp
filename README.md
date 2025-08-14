# Project Title

Todo Tracker is a task management app that lets users add, edit, delete, and track todos with due dates. It features secure authentication, allowing access to the dashboard only when logged in. The dashboard also includes a progress report showing total tasks, completed tasks, completion rate, and overdue items.


## Screenshots

![Registration Page](https://github.com/user-attachments/assets/17d23169-8957-463a-96ee-78544f3bc090)

![Login Page](https://github.com/user-attachments/assets/6d544fed-3d44-4175-a925-4dabb3562416)

![Dashboard](https://github.com/user-attachments/assets/8c2700f8-d11d-4934-810d-a165c2759738)

![Add Task](https://github.com/user-attachments/assets/037d72fa-8286-4f99-a0aa-8f24e135cc64)







## Tech Stack

**Client:** React JS, Context API, CSS, Axios, React-Router,

**Server:** JSON Server


## Demo

https://task-tracker-app-olive.vercel.app/


## How to install and run project

Install my-project with npm

```bash
  cd my-project
  npm install 
  npm run dev
  npm install -g json-server
  json-server --watch db.json
```
    
## Acknowledgements

- Special thanks to [Steve](https://github.com/Asumba-lab) for his collaboration and valuable contributions to this project.

---

## Local dev server (Express + JWT)

A minimal Express auth server has been added for local development. It uses `db.json` for persistence and supports register/login with JWTs.

Start the server:

```bash
cd server
npm install
npm run dev
```

Server endpoints:
- POST /auth/register -> { token, user }
- POST /auth/login -> { token, user }
- GET /tasks?userId=... -> public read
- POST /tasks, PUT /tasks/:id, PATCH /tasks/:id, DELETE /tasks/:id -> protected (require Authorization header: `Bearer <token>`)

Important:
- This server is for local/demo use only. Do not deploy it to production.
- Set a secure JWT secret in production via the `JWT_SECRET` env var.
- The frontend reads `VITE_API_BASE_URL` to determine the API base URL. Set it when deploying the frontend.
