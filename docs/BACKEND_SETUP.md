# ⚙️ Backend Setup & Execution Guide

This guide walks you through setting up the Django REST Framework backend locally.

---

## System Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| **Python** | 3.11+ | [Download](https://www.python.org/downloads/) |
| **PostgreSQL** | 14+ | Running on port `5432` |
| **pip** | Latest | Comes with Python |

---

## 1. Database Configuration

Before booting Django, provision an empty database in your PostgreSQL cluster:

```bash
# Using psql CLI
psql -U postgres -c "CREATE DATABASE alumni_db;"

# Or using pgAdmin: Create Database → Name: alumni_db
```

---

## 2. Environment Variables

Copy the template and configure your local credentials:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your actual values:
```env
DJANGO_SECRET_KEY=your-unique-secret-key-here
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=alumni_db
DB_USER=postgres
DB_PASSWORD=your_actual_password
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

> ⚠️ **Never commit your `.env` file.** The `.gitignore` already excludes it.

---

## 3. Python Virtual Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it:
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# Windows (CMD):
.\venv\Scripts\activate.bat

# Mac/Linux:
source venv/bin/activate
```

---

## 4. Install Dependencies

```bash
# Ensure you're in the backend directory with venv activated
python -m pip install -r requirements.txt
```

**Dependencies installed:**
| Package | Purpose |
|---------|---------|
| `django` | Web framework |
| `djangorestframework` | REST API toolkit |
| `djangorestframework-simplejwt` | JWT authentication |
| `django-cors-headers` | Cross-origin request handling |
| `psycopg2-binary` | PostgreSQL adapter |
| `python-decouple` | Environment variable management |

---

## 5. Database Migrations

Apply the schema defined in `api/models.py` to your PostgreSQL database:

```bash
python manage.py makemigrations api
python manage.py migrate
```

---

## 6. Create Admin Account

Create a superuser to access the Django admin panel and test the API:

```bash
python manage.py createsuperuser
```

Follow the prompts for email and password.

---

## 7. Run the Server

```bash
python manage.py runserver
```

| URL | Purpose |
|-----|---------|
| `http://127.0.0.1:8000/api/` | REST API root (browsable) |
| `http://127.0.0.1:8000/admin/` | Django admin panel |

---

## 8. Run Tests

```bash
python manage.py test api --verbosity=2
```

Or from the project root using npm:
```bash
npm run test:backend
```

---

## 9. Quick NPM Scripts (from project root)

These scripts handle the backend from the project root directory:

| Command | Description |
|---------|-------------|
| `npm run setup:backend` | Creates venv + installs requirements |
| `npm run backend` | Starts Django dev server |
| `npm run db:migrate` | Runs makemigrations + migrate |
| `npm run db:admin` | Creates superuser |
| `npm run db:flush` | Resets database (⚠️ destructive) |
| `npm run test:backend` | Runs the test suite |
| `npm run dev` | Starts both frontend + backend |

---

## Troubleshooting

### `psycopg2` fails to install
```bash
# Use the binary version instead
pip install psycopg2-binary
```

### `ModuleNotFoundError: No module named 'decouple'`
```bash
pip install python-decouple
```

### Database connection refused
1. Ensure PostgreSQL is running: `pg_isready`
2. Verify your `.env` credentials match your PostgreSQL setup
3. Ensure the database `alumni_db` exists: `psql -U postgres -l`

### CORS errors in browser console
Ensure `CORS_ALLOWED_ORIGINS` in your `.env` includes the frontend URL (e.g., `http://localhost:3000`).
