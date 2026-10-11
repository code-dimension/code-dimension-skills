# Club (Área de Membros) - Hotmart API v1

## Domain: Club

This reference provides endpoints related to managing and querying Hotmart Club (Members Area), which organizes your online course modules, pages (lessons), and students.

### Subdomain Constraint
> [!IMPORTANT]
> All Club API endpoints **require** the `subdomain` query parameter. This subdomain is the name of your Members Area as defined in your Hotmart Club settings (e.g. `myschool` for `myschool.club.hotmart.com`).

---

### 1. Listar Alunos (Get Students/Users)
- **Description:** Retrieves a list of students registered in the specific Members Area.
- **Endpoint:** `GET /club/api/v1/users`
- **Parameters (Query):**
  - `subdomain` (string, required): The subdomain of your Members Area.
  - `email` (string, optional): Filter by exact or partial student email.
  - `max_results` (int): Items per page.
  - `page_token` (string): Cursor token for pagination.
- **How to use:** Call this to verify if a user has an active registration inside the Hotmart Club or to sync student records with your database.
- **Success Return (200 OK):**
  ```json
  {
    "items": [
      {
        "id": 12345678,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "STUDENT",
        "registration_date": 1690000000000,
        "active": true
      }
    ],
    "page_info": {
      "next_page_token": "eyJwYWdlIjoyLCJzaXplIjo1MH0=",
      "results_per_page": 50
    }
  }
  ```
- **Error Return:** `400 Bad Request` (missing subdomain), `401 Unauthorized`.

---

### 2. Listar Módulos (Get Modules)
- **Description:** Retrieves the list of course modules configured in your Members Area.
- **Endpoint:** `GET /club/api/v1/modules`
- **Parameters (Query):**
  - `subdomain` (string, required): The subdomain of your Members Area.
- **How to use:** Fetch your course structure to map out modules in a custom frontend or dashboard.
- **Success Return (200 OK):**
  ```json
  {
    "items": [
      {
        "id": 55432,
        "name": "Module 1: Introduction",
        "description": "Start your journey here",
        "order": 1,
        "active": true
      },
      {
        "id": 55433,
        "name": "Module 2: Advanced Topics",
        "description": "Deep dive into techniques",
        "order": 2,
        "active": true
      }
    ],
    "page_info": {
      "results_per_page": 20
    }
  }
  ```
- **Error Return:** `400 Bad Request`, `401 Unauthorized`.

---

### 3. Listar Páginas/Aulas de um Módulo (Get Pages/Lessons)
- **Description:** In the Hotmart Club structure, course content/lessons are represented as **Pages**. This endpoint returns all pages configured under a specific module.
- **Endpoint:** `GET /club/api/v1/modules/{module_id}/pages`
- **Parameters:**
  - `module_id` (long, path, required): The unique identifier of the module (retrieved via "Get Modules").
  - `subdomain` (string, query, required): The subdomain of your Members Area.
- **How to use:** Build a navigation list of lessons/pages for your students or verify what content is available under a module.
- **Success Return (200 OK):**
  ```json
  {
    "items": [
      {
        "id": 987654,
        "name": "Lesson 1.1: Hello World",
        "description": "Writing your first line of code",
        "order": 1,
        "module_id": 55432,
        "active": true,
        "free": true
      },
      {
        "id": 987655,
        "name": "Lesson 1.2: Project Setup",
        "description": "Configuring your developer environment",
        "order": 2,
        "module_id": 55432,
        "active": true,
        "free": false
      }
    ],
    "page_info": {
      "results_per_page": 20
    }
  }
  ```
- **Error Return:** `400 Bad Request`, `401 Unauthorized`, `404 Not Found`.
