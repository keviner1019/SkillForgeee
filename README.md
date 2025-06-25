# SkillForge 🚀

> **An intelligent learning path generator with real-time collaboration and translation features**

SkillForge is a modern web application that solves a common problem for self-learners: "What's the best way to learn a new skill?" Instead of sifting through countless articles and tutorials, users simply tell SkillForge their learning goal, and the AI backend generates a comprehensive, visual, and interactive learning path presented as a beautiful node-based mind map.

## ✨ Features

### Core Features
- **🤖 AI-Powered Path Generation**: Generate comprehensive learning paths using advanced language models
- **🗺️ Interactive Mind Maps**: Beautiful node-based visualization using React Flow
- **📊 Progress Tracking**: Track your learning progress with visual status indicators
- **📝 Rich Note Taking**: Integrated rich-text editor for personal notes
- **⏰ Deadline Management**: Set and manage deadlines for learning nodes
- **🎨 Customizable Themes**: Personalize your learning paths with colors and themes

### Real-time Collaboration ⚡
- **👥 Multi-user Collaboration**: Work together on learning paths in real-time
- **🔄 Live Updates**: See changes from other collaborators instantly
- **👁️ Live Cursors**: See where other users are working
- **🔐 Permission Management**: Control who can view, edit, or admin your paths

### Real-time Translation 🌍
- **🗣️ Instant Translation**: Translate any content on the fly
- **💾 Translation Cache**: Smart caching for frequently translated content
- **🌐 Multi-language Support**: Support for dozens of languages
- **📚 Translation History**: Access your translation history

### User Management
- **🔐 Secure Authentication**: JWT-based authentication system
- **👤 User Profiles**: Customizable user profiles with avatars
- **🌐 Public/Private Paths**: Share your learning journeys or keep them private
- **🤝 Community Features**: Browse and learn from public learning paths

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** + **shadcn/ui** for styling
- **React Flow** for interactive node graphs
- **Zustand** for state management
- **React Hook Form** + **Zod** for form validation
- **Socket.IO Client** for real-time features
- **TipTap** for rich text editing
- **Framer Motion** for animations

### Backend
- **Node.js** + **Express** with TypeScript
- **PostgreSQL** with **Prisma ORM**
- **Socket.IO** for real-time collaboration
- **JWT** for authentication
- **OpenAI API** for AI-powered path generation
- **Google Translate API** for translation features
- **bcryptjs** for password hashing
- **Rate limiting** and security middleware

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- OpenAI API key
- Google Translate API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/skillforge.git
   cd skillforge
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   **Server (.env):**
   ```bash
   cd server
   cp env.example .env
   # Edit .env with your configuration
   ```
   
   **Client (.env):**
   ```bash
   cd client
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend (port 5000) and frontend (port 5173) servers.

### Alternative: Run servers separately

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

## 📖 Project Structure

```
skillforge/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   └── ui/        # shadcn/ui components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── stores/        # Zustand stores
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript type definitions
│   │   └── lib/           # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── prisma/            # Database schema & migrations
│   ├── package.json
│   └── tsconfig.json
├── package.json           # Root package.json for workspace
└── README.md
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run install:all` - Install dependencies for all packages
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio for database management

### Frontend (client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (server/)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## 🌟 Key Features Explained

### AI-Powered Learning Path Generation
The core "magic moment" of SkillForge. Users input a learning goal, and the AI creates a structured, hierarchical learning path with interconnected nodes, descriptions, and suggested learning order.

### Real-time Collaboration
Multiple users can work on the same learning path simultaneously. Changes are synchronized in real-time using Socket.IO, including:
- Node updates and status changes
- Live cursor positions
- User presence indicators
- Permission-based access control

### Translation System
Built-in translation capabilities allow users to:
- Translate any content instantly
- Cache translations for performance
- Access translation history
- Support for 100+ languages via Google Translate API

### Interactive Visualization
Learning paths are displayed as interactive node graphs using React Flow:
- Drag and drop functionality
- Zoom and pan controls
- Hierarchical node relationships
- Visual progress indicators
- Custom node styling based on status

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input validation using Zod
- **CORS Protection**: Proper CORS configuration
- **Helmet Security**: Security headers via Helmet.js
- **Password Hashing**: Secure password hashing with bcryptjs

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `dist` folder to your preferred platform

### Backend (Railway/Render)
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy server folder
4. Run migrations: `npx prisma migrate deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for the GPT API that powers learning path generation
- The React Flow team for the excellent graph visualization library
- The shadcn/ui team for the beautiful component library
- All the open-source libraries that make this project possible

---

**Built with ❤️ for learners, by learners** 