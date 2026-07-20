# Task Manager — Full Stack CRUD App

A full stack Task Manager built with **HTML, CSS, Vanilla JavaScript, PHP, and MySQL**.
The frontend talks to a custom PHP REST-style API (no third-party API used).

## Tech Stack

| Layer        | Technology                     |
|--------------|---------------------------------|
| Frontend     | HTML, CSS, Vanilla JavaScript (`fetch`) |
| Backend      | PHP (procedural, `mysqli`)      |
| Database     | MySQL / phpMyAdmin              |
| Server       | XAMPP (Apache + MySQL)          |

## Project Structure

```
task-manager/
├── backend/
│   ├── config.php        # DB credentials
│   ├── db.php             # DB connection + shared headers
│   ├── get_tasks.php      # GET    -> read all tasks
│   ├── add_task.php       # POST   -> create a task
│   ├── update_task.php    # POST/PUT -> update a task
│   ├── delete_task.php    # POST/DELETE -> delete a task
│   └── database.sql       # DB + table schema (+ sample rows)
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

## API Endpoints

| Method      | Endpoint                | Description       | Body (JSON)                                      |
|-------------|--------------------------|--------------------|---------------------------------------------------|
| GET         | `get_tasks.php`          | Get all tasks      | –                                                   |
| POST        | `add_task.php`           | Add a new task     | `{ "title": "...", "description": "..." }`        |
| POST / PUT  | `update_task.php`        | Update a task      | `{ "id": 1, "title": "...", "description": "...", "is_completed": true }` |
| POST / DELETE | `delete_task.php`      | Delete a task      | `{ "id": 1 }`                                       |

All endpoints return JSON in the form `{ "success": true/false, "message": "...", "data": ... }`.

## Setup (XAMPP)

1. **Start XAMPP** — turn on **Apache** and **MySQL**.

2. **Copy the project** into your XAMPP `htdocs` folder, e.g.:
   ```
   C:/xampp/htdocs/task-manager/
   ```
   (so the backend is reachable at `http://localhost/task-manager/backend/`)

3. **Create the database** — open [phpMyAdmin](http://localhost/phpmyadmin), go to the **SQL** tab, and run the contents of `backend/database.sql`.
   This creates the `task_manager` database, the `tasks` table, and inserts two sample rows.

4. **Check `backend/config.php`** — defaults match a stock XAMPP install (`root` user, no password). Edit if your setup differs.

5. **Open the frontend** — visit:
   ```
   http://localhost/task-manager/frontend/index.html
   ```

6. If your project folder isn't named `task-manager`, update `API_BASE` at the top of `frontend/script.js` to match your path.

## CRUD Flow

- **Create** — fill in the task name (and optional description) and click **Add Task**. It's saved to MySQL and appears at the top of the list instantly.
- **Read** — tasks load automatically from MySQL when the page opens.
- **Update** — click **Edit** to load a task into the form, change it, and click **Save Changes**. You can also click the checkbox to mark a task complete/incomplete.
- **Delete** — click **Delete** and confirm to remove a task permanently.
- **Refresh** — reload the page; data persists because it's stored in MySQL, not just in memory.

## Notes

- Loading and error states are handled in the UI (`#loading` / `#error` in `index.html`), so the app never shows a blank screen while fetching or on failure.
- `tasks` in `script.js` is the single in-memory state array; every create/update/delete keeps it in sync with the database and re-renders the list from it.
