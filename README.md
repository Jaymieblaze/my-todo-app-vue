# Vue.js Todo App with AI Assistant

A modern, feature-rich todo application built with Vue 3, TypeScript, Firebase, and AI integration using Groq. This app provides a seamless task management experience with real-time synchronization, intelligent task generation, and a beautiful responsive interface.

## 🚀 Features

- **Authentication**: Secure Google Sign-In with Firebase Auth
- **Real-time Data**: Cloud Firestore for instant synchronization across devices
- **AI Assistant**: Intelligent task generation powered by Groq AI
- **Responsive Design**: Beautiful UI with Tailwind CSS and dark/light theme support
- **Offline Support**: Works offline with automatic sync when reconnected
- **Task Management**: Create, edit, delete, and organize tasks with priorities and due dates
- **Search & Filter**: Advanced filtering by status, priority, and due date
- **Pagination**: Efficient handling of large task lists

## 🛠️ Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **AI Integration**: Groq SDK
- **State Management**: Pinia
- **Routing**: Vue Router
- **Deployment**: Vercel (with serverless functions)

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (^20.19.0 || >=22.12.0)
- npm or yarn
- Firebase project with Authentication and Firestore enabled
- Groq API key for AI features

## 🔧 Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project.appspot.com
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_app_id
VITE_MEASUREMENT_ID=your_measurement_id

# Groq AI Configuration
GROQ_API_KEY=your_groq_api_key
```

## 🚦 Getting Started

### Installation

```sh
npm install
```

### Development

For local development with both frontend and API:

```sh
# Start the Vue.js development server
npm run dev

# In a separate terminal, start the API development server
npm run dev:api
```

The app will be available at `http://localhost:5173`
The API development server runs on `http://localhost:3001`

### Production Build

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

## 🏗️ Project Structure

```
my-todo-app-vue/
├── api/                     # Serverless functions
│   └── generate-tasks.ts    # Groq AI integration endpoint
├── src/
│   ├── components/          # Reusable Vue components
│   ├── composables/         # Vue composables
│   ├── router/             # Vue Router configuration
│   ├── stores/             # Pinia state management
│   ├── utils/              # Utility functions
│   ├── views/              # Page components
│   ├── firebase.ts         # Firebase configuration
│   └── main.ts            # App entry point
├── public/                 # Static assets
└── vercel.json            # Vercel deployment configuration
```

## 🔑 Key Features Explained

### AI Assistant
- Powered by Groq's fast inference API
- Generates contextual task suggestions
- Helps with task prioritization and planning

### Firebase Integration
- Google Authentication for secure sign-in
- Real-time Firestore database for instant sync
- Offline persistence with automatic reconnection

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Dark/light theme support
- Smooth animations and transitions

## 🚀 Deployment

This app is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

The `vercel.json` configuration handles both static site deployment and serverless API functions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

Built with ❤️ using Vue.js and modern web technologies.
