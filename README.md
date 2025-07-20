# Yapping - Real-time Chat Application

A modern real-time chat application built with React, TypeScript, and WebSocket protocol. Users can join chat rooms and exchange messages in real-time.

## 🚀 Live Demo

- Live Link: [Vercel Deployment](https://yapping-nine.vercel.app/)

## ✨ Features

- Real-time messaging using WebSocket
- Room-based chat system
- Modern, accessible UI with shadcn/ui
- Responsive design
- User avatars using DiceBear API
- Connection status indicators

## 🛠️ Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - WebSocket client

- **Backend:**
  - Node.js
  - WebSocket server

- **Infrastructure:**
  - Turborepo (Monorepo)
  - Vite
  - Vercel
  - Render

## 🏗️ Project Structure

```
yapping/
├── apps/
│   ├── frontend/     # React frontend application
│   └── backend/      # WebSocket server
└── packages/         # Shared packages
```

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/adisvara/yapping-web.git
cd yapping
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

## 💻 Development

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:8080`

## 🌐 Environment Variables

Create `.env` files in respective directories:

```env
# Frontend (.env)
VITE_WS_URL=ws://localhost:8080

# Backend (.env)
PORT=8080
```

## 📝 License

MIT

## 👤 Author

Shivam Kumar
- GitHub: [@adisvara](https://github.com/adisvara)
