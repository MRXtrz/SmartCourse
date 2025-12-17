# 🎓 Smart Course Platform - Frontend

Beautiful, modern frontend for the Smart Course Platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

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

### Admin Panel
- Course management (CRUD)
- Lesson management (CRUD)
- Modal forms for creation/editing

## 🤖 AI Tutor

The AI Tutor appears as a chat interface with:
- Bot avatar and animations
- Message history
- Real-time responses
- Context-aware answers about the current lesson

## 🎯 Key UX Features

1. **Personalization**
   - Welcome message with user name
   - Recommended courses based on progress
   - Progress tracking per course

2. **Visual Feedback**
   - Loading states
   - Progress indicators
   - Completion badges
   - Smooth transitions

3. **Smart Navigation**
   - Breadcrumbs
   - Back buttons
   - Active route highlighting

4. **Accessibility**
   - Semantic HTML
   - Keyboard navigation
   - Clear visual hierarchy

## 🚀 Deployment

### Vercel/Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variable `VITE_API_URL` to your backend URL

### Docker

Create a Dockerfile:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📝 Notes

- Make sure the backend API is running before starting the frontend
- CORS must be enabled on the backend for local development
- The AI Tutor requires a valid OpenAI API key in the backend
