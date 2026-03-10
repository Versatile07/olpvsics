# OLP VSICS - Frontend

The frontend for the **Online Learning Portal (OLP)** developed for VSICS. It provides a modern, responsive, and intuitive interface for students and faculty to manage educational activities.

## 🚀 Technologies Used

- **React (v19)**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool and development server.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **React Router (v7)**: Declarative routing for React applications.
- **Axios**: A promise-based HTTP client for API interactions.
- **PostCSS & Autoprefixer**: For modern CSS processing.

## 📁 Project Structure

```text
frontend/
├── src/
│   ├── api/          # API services and Axios configurations
│   ├── components/   # Reusable UI components
│   ├── pages/        # Main application views (Home, Login, Dashboard, etc.)
│   ├── styles/       # Global styles and Tailwind configurations
│   ├── utils/        # Helper functions and utilities
│   ├── App.jsx       # Main application component with routing
│   └── main.jsx      # Application entry point
├── public/           # Static assets
└── tailwind.config.js # Tailwind CSS configuration
```

## ✨ Key Features

- **Personalized Dashboard**: A central hub for students and faculty.
- **Secure Authentication**: Streamlined login for different user roles.
- **Course Management**: Access to assignments, notes, and notices.
- **Responsive Design**: Optimized for various screen sizes (Mobile, Tablet, Desktop).
- **Modern UI**: Consistent tech-savvy aesthetic with glassmorphism and smooth animations.

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

### Build for Production

Generate a production-ready build:
```bash
npm run build
```

## 📜 Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the project for production.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run preview`: Previews the production build locally.
