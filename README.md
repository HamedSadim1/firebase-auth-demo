# Firebase Authentication Demo

A modern React application demonstrating Firebase authentication — Google OAuth and email/password — with profile-photo uploads to Firebase Storage. Built with Vite, TypeScript and Tailwind CSS v4.

## 🚀 Features

- **Google OAuth** — sign in with a Google account
- **Email/password authentication** — register and log in with email and password
- **Persistent sessions** — `onAuthStateChanged` + `setPersistence` ("Onthoud mij")
- **Password reset** — sends a reset link via `sendPasswordResetEmail`
- **Profile photo upload** — uploads an avatar to Firebase Storage
- **Responsive dark UI** — amber/teal identity, keyboard-accessible and screen-reader friendly
- **Per-action loading states** and Dutch error messages
- **TypeScript** — full type safety end-to-end

## 🛠️ Tech Stack

- **React 19** — UI library
- **TypeScript** — type safety
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — utility-first styling (`@tailwindcss/vite`)
- **Firebase** — Authentication + Storage
- **tailwind-merge + clsx** — conflict-free class merging via `cn()`

## 📋 Prerequisites

- Node.js `^20.19.0` or `>=22.12.0` (Vite requirement)
- npm
- A Firebase project

## 🔧 Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd firebase-auth-demo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment configuration**

   Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

   Fill in your Firebase config in `.env`:

   ```env
   # Get these from Firebase Console > Project Settings > General > Your apps
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # App configuration (optional — defaults shown)
   VITE_APP_TITLE=Firebase Auth Demo
   VITE_APP_VERSION=auth.demo.v2
   VITE_STORAGE_UPLOAD_PATH=profile-images
   ```

4. **Firebase setup**

   - Create a project in the [Firebase Console](https://console.firebase.google.com/)
   - Enable **Authentication** and configure the **Google** and **Email/Password** sign-in methods
   - Enable **Storage** if you want photo uploads to work
   - Copy the config values into `.env`

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

### Preview the Production Build

```bash
npm run preview
```

## 🧰 Development Tooling

This project ships with linting and commit tooling wired up via [husky](https://typicode.github.io/husky/):

| Command                | What it does                                               |
| ---------------------- | ---------------------------------------------------------- |
| `npm run lint`         | Run ESLint (full recommended + type-checked + React rules) |
| `npm run lint:fix`     | Run ESLint and auto-fix issues                             |
| `npm run format`       | Format all files with Prettier                             |
| `npm run format:check` | Check formatting without changing files                    |
| `npm run typecheck`    | Run `tsc --noEmit` to check types                          |

- **ESLint** (`eslint.config.js`) — flat config with `@eslint/js` recommended, `typescript-eslint` recommended + stylistic (type-checked), `eslint-plugin-react`, `react-hooks`, and `react-refresh` rules.
- **Prettier** (`.prettierrc.json`) — code formatter; `eslint-config-prettier` disables the ESLint rules that would conflict with it.
- **Commit messages** must follow [Conventional Commits](https://www.conventionalcommits.org/) — enforced by `commitlint` on `git commit` (e.g. `feat: add login`, `fix: correct validation`).
- **Staged files** are formatted with Prettier and linted/auto-fixed with ESLint on `git commit` via `lint-staged`.
- **Pre-push** runs `typecheck` and `lint` to keep the branch green.

## 🔒 Security Notes

- Never commit your `.env` file to version control
- The `.env` file is automatically ignored by git
- Use `.env.example` as a template for other developers
- All Firebase config values are exposed to the client-side (this is normal for Firebase)

## 📁 Project Structure

```
src/
├── App.tsx              # Orchestrates the auth flow
├── index.tsx            # Entry point (wrapped in ErrorBoundary)
├── index.css            # Tailwind import + design tokens (@theme)
├── firebaseConfig.tsx   # Firebase init + env validation
├── components/
│   ├── index.ts         # Barrel export
│   ├── ErrorBoundary.tsx
│   ├── auth/            # Login/register screen
│   ├── profile/         # Logged-in screen
│   └── ui/              # Reusable primitives (Banner, Spinner, LoadingState)
├── hooks/
│   ├── useAuth.ts       # Session state + Firebase operations
│   └── useAuthForm.ts   # Form state + validation
├── lib/
│   ├── constants.ts     # Central constants + messages
│   ├── config.ts        # env-driven configuration
│   ├── types.ts         # Shared types
│   ├── validation.ts    # Validators
│   ├── errors.ts        # Firebase error → message mapping
│   ├── styles.ts        # Shared class builders + focus rings
│   ├── async.ts         # withTimeout helper
│   ├── cn.ts            # clsx + tailwind-merge
│   └── user.ts          # getUserDisplayName helper
└── svg/                 # Icons (Icon base + individual icons)
```

> Imports use the `@/` path alias, which points to `src/` (configured in `tsconfig.json` and `vite.config.mjs`).

