# Luna Moth Gifts - Project Context

This document provides a comprehensive overview of the Luna Moth Gifts web application project. Its purpose is to quickly bring the AI assistant up to speed on the project's status, architecture, and key decisions.

## 1. Project Overview

- **Name:** Luna Moth Gifts
- **Description:** A modern e-commerce web application for a crystal and gemstone business.
- **Core Features:**
  - Publicly viewable product catalog.
  - AI-powered "Crystal Oracle" (using Google Gemini) to recommend products based on user's feelings or intentions.
  - User authentication (Sign-up/Login) via Firebase Authentication.
  - Persistent shopping cart for authenticated users, saved to Firestore.
  - User account management page with profile editing and order history.
  - Fully responsive design for desktop and mobile.

## 2. Development Environment

- **Platform:** The application is developed within the **Google AI Studio** environment.
- **Implications:**
  - The file system is managed through user prompts.
  - There is no direct terminal access for running commands or installing dependencies.
  - Frontend dependencies (`react`, `firebase`, `@google/genai`) are loaded via a CDN specified in the `importmap` within `index.html`.

## 3. Technology Stack

- **Frontend Framework:** React 19 (with TypeScript).
- **Styling:** Tailwind CSS (loaded via CDN and configured in `index.html`).
- **Backend-as-a-Service (BaaS):** Google Firebase
  - **Authentication:** Firebase Auth (Email/Password).
  - **Database:** Cloud Firestore for storing user profiles, cart contents, and order history.
- **AI/ML:** Google Gemini API (`gemini-2.5-flash` model) via the `@google/genai` SDK.
- **Build Tool:** `esbuild` is used to bundle the application, as defined in the `build` script in `package.json`.

## 4. Project Structure

- `index.html`: Main HTML entry point. Contains the `importmap` for dependencies and Tailwind CSS configuration.
- `index.tsx`: Root of the React application.
- `App.tsx`: The main application component, handling global state, page routing, and modal/panel visibility.
- **`components/`**: Contains all reusable React components (e.g., `Header`, `ProductCard`, `AuthModal`).
  - **`components/icons/`**: A sub-directory for individual SVG icon components.
- **`pages/`**: Contains top-level components that represent a full page view (e.g., `InventoryPage`, `AccountPage`).
- **`services/`**: Modules for handling external API interactions.
  - `firebaseService.ts`: Manages all Firebase Authentication logic.
  - `firestoreService.ts`: Manages all Cloud Firestore database logic.
  - `geminiService.ts`: Manages all calls to the Google Gemini API.
- **`hooks/`**: Custom React hooks (`useToast.ts`).
- `firebaseConfig.ts`: Holds the Firebase project configuration object. This file is populated by environment variables during the build process.
- `types.ts`: Central location for all shared TypeScript type definitions (`User`, `Product`, `CartItem`, etc.).
- `constants.ts`: Contains static data, primarily the product catalog.
- `package.json`: Defines project metadata, dependencies, and the `build` script.
- `tsconfig.json`: TypeScript compiler settings.
- `cloudbuild.yaml`: Defines the CI/CD pipeline.

## 5. Key Architectural Decisions & History

### **Environment Configuration Strategy**

- **Problem:** The app needs API keys to run, but these keys are only injected during the Cloud Build deployment, causing the app to crash with a "configuration missing" error in the AI Studio IDE.
- **Solution:** A graceful fallback mechanism has been implemented in `firebaseConfig.ts` and `services/geminiService.ts`.
  - The code attempts to read API keys from `process.env` (for the deployed production environment).
  - If an environment variable is not found (the case in the AI Studio IDE), it falls back to a non-functional placeholder string (e.g., `'MISSING_API_KEY_IN_IDE'`).
- **Outcome:** This allows the app to initialize and run without errors in the IDE, enabling UI development and testing of non-API-dependent features. Full functionality (Auth, Gemini) is only available in the final deployed version where the real keys are present.

### **Firebase SDK Version: v8 Compatibility**

- **This is a critical point.** The project has been standardized to use the **Firebase v8 compatibility API** (`firebase/compat/app`, `firebase/compat/auth`, etc.).
- This decision was made to resolve persistent module import errors and ensure stability. All Firebase-related code in `services/firebaseService.ts` and `services/firestoreService.ts` uses the v8 syntax (e.g., `firebase.auth()`, `db.collection('users').doc(uid)`).
- **Future work on Firebase must adhere to this v8 compat pattern to avoid regressions.**

### **State Management**

- Global application state (e.g., current user, cart items, open modals) is managed in the root `App.tsx` component using React's built-in hooks (`useState`, `useEffect`).
- State and handler functions are passed down to child components via props (prop drilling).

## 6. CI/CD Pipeline (via Google Cloud Build)

The CI/CD process is fully automated and defined in `cloudbuild.yaml`.

- **Trigger Source:** A Cloud Build trigger is connected to the GitHub repository **`PrestonHughes/lunamothgiftsweb`** via the "Developer Connect" service.
- **Process:**
  1.  **Install Dependencies:** Runs `npm install`.
  2.  **Build Application:** Runs `npm run build`. During this step, secrets and environment variables are injected as substitution variables from the Cloud Build trigger configuration (e.g., `_API_KEY`, `_FIREBASE_API_KEY`, etc.).
  3.  **Containerization:**
      - A `Dockerfile` and `nginx.conf` are generated dynamically during the build.
      - The `nginx.conf` is configured to serve the React application as a Single-Page App (SPA), correctly handling client-side routing.
      - The `Dockerfile` uses a lightweight `nginx` base image and copies the built application assets into it.
  4.  **Build & Push Image:** The Docker image is built and pushed to Google Artifact Registry.
  5.  **Deploy:** The newly pushed container image is deployed to a Google Cloud Run service named `luna-moth-gifts`.
- **Permissions:** The deployment is executed by a dedicated service account (`cloud-build-deployer@...`) which has key IAM roles, including `Cloud Run Admin`, `Artifact Registry Administrator`, and `Cloud Build Service Account`, to manage the process. The `firebase-adminsdk@...` service account also has relevant Firebase permissions.