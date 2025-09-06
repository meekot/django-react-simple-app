# Django React Simple App

A full-stack notes application built with Django REST Framework and React, featuring user authentication, CRUD operations, and admin functionality.

## 🚀 Tech Stack

### Backend
- **Django** - Python web framework
- **Django REST Framework** - API development
- **Django REST Framework SimpleJWT** - JWT authentication
- **PostgreSQL** - Database (with psycopg2-binary)
- **Django CORS Headers** - Cross-origin resource sharing
- **Python-dotenv** - Environment variables management

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **HeroUI** - Modern React component library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **JWT Decode** - JWT token handling
- **Bun** - Package manager

## 📋 Features

- **User Authentication**: Register, login, and JWT-based authentication
- **Notes Management**: Create, read, and delete personal notes
- **Community Feed**: View notes from all users
- **Admin Panel**: Staff users can delete any note
- **Responsive Design**: Mobile-friendly interface with dark/light theme
- **Protected Routes**: Authentication-required pages
- **Real-time Feedback**: Success/error notifications

## 🏗️ Project Structure

```
django-react-simple-app/
├── backend/                 # Django API
│   ├── api/                # Main API app
│   │   ├── models.py       # Note model
│   │   ├── views.py        # API endpoints
│   │   ├── serializers.py  # Data serialization
│   │   ├── permissions.py  # Custom permissions
│   │   └── urls.py         # API routes
│   ├── backend/            # Django project settings
│   └── requirements.txt    # Python dependencies
└── frontend/               # React application
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── layouts/        # Layout components
    │   ├── types/          # TypeScript types
    │   ├── config/         # App configuration
    │   └── api.ts          # API client
    ├── package.json        # Node dependencies
    └── tailwind.config.js  # Tailwind configuration
```

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- Bun (or npm/yarn)
- PostgreSQL

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/meekot/django-react-simple-app.git
   cd django-react-simple-app
   ```

2. **Set up Python virtual environment**
   ```bash
   cd backend
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   Create a `.env` file in the backend directory with:
   ```env
   SECRET_KEY=your-secret-key
   DEBUG=True
   DATABASE_URL=postgresql://username:password@localhost:5432/dbname
   ```

5. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the Django server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the frontend directory with:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   bun dev
   # or npm run dev
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/token/` - Login (get JWT tokens)
- `POST /api/token/refresh/` - Refresh access token
- `POST /api/register/` - User registration

### Notes
- `GET /api/notes/` - Get user's notes
- `POST /api/notes/` - Create new note
- `DELETE /api/notes/{id}/` - Delete note (owner or admin)

### User
- `GET /api/user/` - Get current user info

## 🎨 UI Components

The frontend uses HeroUI components for a modern, accessible interface:
- Navigation bar with theme switcher
- Responsive cards for notes display
- Form inputs with validation
- Alert notifications
- Loading states and animations

## 🔐 Authentication Flow

1. Users register/login through the frontend
2. JWT tokens are stored in localStorage
3. API requests include the access token in headers
4. Protected routes redirect unauthenticated users to login
5. Tokens are automatically refreshed when expired

## 👥 User Roles

- **Regular Users**: Can create, view, and delete their own notes
- **Staff/Admin Users**: Can delete any note in the system

## 🚀 Deployment

### Backend (Django)
- Configure production settings
- Set up PostgreSQL database
- Use gunicorn or similar WSGI server
- Configure static files serving

### Frontend (React)
- Build the production bundle: `bun run build`
- Deploy to Vercel, Netlify, or similar platform
- Update API URL in environment variables

## 📝 Development Notes

- The project uses TypeScript for type safety
- Tailwind CSS provides utility-first styling
- JWT tokens handle authentication state
- Django CORS headers enable cross-origin requests
- The app is responsive and supports dark/light themes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
