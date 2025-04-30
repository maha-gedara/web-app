# 💻 MEDIZ - Frontend

The **MEDIZ Frontend** is built with **React (Vite)** and **Tailwind CSS** to provide a clean, responsive, and user-friendly interface for managing hospital operations.

## ✨ Features

- 📝 Patient record management (CRUD)
- 🔍 Search and filter patients
- 🧠 Add symptoms & AI illness prediction
- 📥 Generate patient reports
- 🔔 Real-time alerts with React Toastify
- 💊 View real-time pharmacy stock

## 🧰 Tech Stack

- **React + Vite**
- **Tailwind CSS**
- **Axios**
- **React Router DOM**
- **React Toastify**

## 📁 Folder Structure

```
mediz-frontend/
├── public/
├── src/
│   ├── components/
│   │   └── patient/       # Reusable UI parts
│   ├── pages/
│   │   └── patient/       # Full views/pages
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── package.json
└── README.md
```

## 🛠️ Getting Started

1. **Clone the repo**
```bash
git clone https://github.com/your-org/mediz-frontend.git
cd mediz-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. **Run the app**
```bash
npm run dev
```

> App runs at: `http://localhost:5173`
