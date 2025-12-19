
- ✅ Beautiful, modern UI with gradient designs
- ✅ Personalized learning experience with progress tracking
- ✅ AI Tutor with smart assistant interface
- ✅ Responsive design (mobile-friendly)
- ✅ Protected routes with authentication
- ✅ Admin panel for course management
- ✅ Real-time progress updates

## 🛠 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📦 Installation

```bash
cd frontend
npm install
```

## ⚙️ Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

## 🏃 Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗 Build

```bash
npm run build
```

The build output will be in the `dist` directory.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Layout.tsx    # Main layout with navigation
│   │   └── AITutor.tsx   # AI Tutor chat component
│   ├── pages/            # Page components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── CoursePage.tsx
│   │   └── AdminPanel.tsx
│   ├── context/          # React Context
│   │   └── AuthContext.tsx
│   ├── services/         # API services
│   │   └── api.ts
│   ├── config/           # Configuration
│   │   └── api.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── tailwind.config.js    # Tailwind configuration
└── package.json
```

## 🎨 Design Features

- **Gradient backgrounds** - Beautiful color gradients throughout
- **Card-based layout** - Modern card design with shadows
- **Progress bars** - Visual progress indicators
- **Smooth animations** - Transitions and hover effects
- **Personalized experience** - User-specific content and recommendations
- **AI Tutor interface** - Chat-style interface with bot avatar

## 🔐 Authentication

The app uses JWT tokens stored in localStorage. Protected routes automatically redirect to login if not authenticated.

## 📱 Pages

### Login/Register
Beautiful authentication pages with gradient backgrounds and form validation.

### Dashboard
Personalized dashboard showing:
- Overall progress
- Course statistics
- Recommended courses
- Course cards with progress bars

### Course Page
- Course overview with progress
- Lesson list with completion status
- Lesson content viewer
- AI Tutor integration
