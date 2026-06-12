# MedAI Guardian — AI Medical Assistant Bot

<p align="center">
  <strong>🏥 Your AI-Powered Medical Education Assistant</strong>
</p>

> ⚠️ **Disclaimer:** This AI Medical Assistant is intended for educational and informational purposes only. It does not provide medical diagnosis, treatment, or professional healthcare advice. Always consult a qualified healthcare professional.

---

## 🌟 Features

| Feature | Description |
|---------|-------------|
| 💬 **AI Symptom Checker** | ChatGPT-style interface for educational symptom information |
| 📄 **Medical Report Analyzer** | Upload PDFs/text reports for AI-powered explanations |
| 🖼️ **Medical Image Analyzer** | Upload images for visual analysis with safety disclaimers |
| 🚨 **Emergency Detection** | Automatic detection of emergency keywords with alerts |
| 📊 **Health Dashboard** | Activity overview with recent analyses and quick actions |
| 🔐 **User Authentication** | JWT-based login/registration with protected routes |
| 📜 **Chat History** | View, continue, and delete past conversations |
| ⚙️ **Settings** | Dark mode toggle, profile updates, clear history |
| 📱 **Responsive Design** | Works perfectly on mobile, tablet, and desktop |

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS v4
- React Router v6
- Axios, Lucide Icons, React Markdown

**Backend:**
- Node.js + Express.js
- Google Gemini 2.5 Flash API
- JWT Authentication
- Multer (file uploads), pdf-parse

**Storage:**
- JSON file-based storage (no database required)

---

## 📦 Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Google AI Studio API Key** — Get one at [aistudio.google.com](https://aistudio.google.com)

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "MedAI Guardian"
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GEMINI_API_KEY=your-gemini-api-key-here
CLIENT_URL=http://localhost:5173
```

### 3. Setup the Frontend

```bash
cd ../client
npm install
```

### 4. Run in Development

Open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

The application will be available at: **http://localhost:5173**

---

## 📁 Project Structure

```
MedAI Guardian/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/         # Navbar, Footer, Sidebar
│   │   │   ├── common/         # Button, Card, Modal, etc.
│   │   │   ├── chat/           # Chat components
│   │   │   ├── report/         # Report components
│   │   │   └── image/          # Image components
│   │   ├── pages/              # Route pages
│   │   ├── context/            # React context providers
│   │   ├── services/           # API service layer
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Router setup
│   │   └── index.css           # Design system
│   └── vite.config.js
│
├── server/                     # Node.js Backend
│   ├── config/                 # App configuration
│   ├── middleware/              # Auth, rate limit, upload, validation
│   ├── routes/                 # API route handlers
│   ├── services/               # Gemini AI & data store
│   ├── data/                   # JSON file storage
│   ├── uploads/                # Temporary file uploads
│   └── server.js               # Express app entry point
│
├── .gitignore
└── README.md
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Backend server port (default: 5000) | No |
| `JWT_SECRET` | Secret key for JWT tokens | **Yes** |
| `GEMINI_API_KEY` | Google AI Studio API key | **Yes** |
| `CLIENT_URL` | Frontend URL for CORS (default: http://localhost:5173) | No |

---

## 🔒 Security Features

- JWT-based authentication with httpOnly considerations
- Password hashing with bcryptjs (10 salt rounds)
- Rate limiting (100 req/15min general, 20 req/15min AI)
- Helmet.js security headers
- Input validation and sanitization
- Secure file upload with type/size restrictions
- Environment variable configuration

---

## 🎨 Design Features

- Modern healthcare theme (blue/white palette)
- Glassmorphism card effects
- Smooth fade-in and slide-up animations
- Dark/light mode toggle
- Responsive design (mobile-first)
- Professional Inter typography
- Lucide icon system

---

## 📝 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Symptom Checker
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/symptom` | Send symptoms for analysis |
| GET | `/api/chat/history` | Get chat history |
| GET | `/api/chat/:id` | Get specific chat |
| DELETE | `/api/chat/:id` | Delete chat |

### Report Analyzer
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/report/analyze` | Upload & analyze report |
| GET | `/api/report/history` | Get report history |

### Image Analyzer
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/image/analyze` | Upload & analyze image |
| GET | `/api/image/history` | Get image history |

### User Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/user/profile` | Update profile |
| PUT | `/api/user/settings` | Update settings |
| DELETE | `/api/user/history` | Clear all history |

---

## 📄 License

This project is for educational purposes only. Not intended for clinical use.

---

<p align="center">
  Made with ❤️ for healthcare education
</p>
