# Firebase Authentication Demo

A modern React application demonstrating Firebase authentication with both Google OAuth and email/password authentication, built with Vite and styled with Tailwind CSS v4.

## 🚀 Features

- **Google OAuth Authentication** - Sign in with Google account
- **Email/Password Authentication** - Register and login with email and password
- **Modern UI** - Beautiful, responsive design with Tailwind CSS
- **Loading States** - Visual feedback during authentication
- **Error Handling** - Comprehensive error messages
- **TypeScript** - Full type safety

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Firebase Authentication** - Authentication service

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project

## 🔧 Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd firebase-basics
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

   Fill in your Firebase configuration in `.env`:

   ```env
   # Get these from Firebase Console > Project Settings > General > Your apps
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # App configuration
   VITE_APP_TITLE=Firebase Auth Demo
   VITE_APP_VERSION=1.0.0
   ```

4. **Firebase Setup**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Enable Authentication in the Firebase Console
   - Configure sign-in methods (Google and Email/Password)
   - Copy the config values to your `.env` file

## 🚀 Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔒 Security Notes

- Never commit your `.env` file to version control
- The `.env` file is automatically ignored by git
- Use `.env.example` as a template for other developers
- All Firebase config values are exposed to the client-side (this is normal for Firebase)

## 📁 Project Structure

```
src/
├── App.tsx              # Main application component
├── firebaseConfig.tsx   # Firebase configuration
├── index.tsx           # Application entry point
├── vite-env.d.ts       # Vite environment types
└── ...
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
