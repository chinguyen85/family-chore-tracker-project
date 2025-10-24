# Family Chore Tracker App

This project is a full-stack family chore management application designed to help family members organize, assign, track, and get rewarded for household tasks.

It features a **React Native (Expo)** mobile application for the frontend and a **RESTful API** built with **Node.js/Express** and **MongoDB** for the backend.

## Tech Stack

| Component            | Technology                    | Role / Purpose                                                                 |
|----------------------|-------------------------------|--------------------------------------------------------------------------------|
| **Frontend**             | **React Native (Expo)**          | Cross-platform mobile client application.                                      |
| **Backend (API)**        | **Node.js, Express**             | Provides authenticated RESTful services.                                       |
| **Database**             | **MongoDB (Mongoose)**           | Data persistence for Users, Families, and Tasks.                               |
| **Authentication**       | **JWT, Bcrypt**                  | Secures user login and protects API routes (`auth.js` middleware).             |
| **File Handling**        | **Multer, Expo ImagePicker**     | Handles image uploads for task proof submission (`ProofUpload.js`, `upload.js`).|
| **Navigation**           | **React Navigation**             | Manages app flow (`AuthNavigator.js`, `MainNavigator.js`).                     |

## How to Run the Project

### Prerequisites

Ensure you have the following installed:

1. **Node.js** (v18+) and **npm**
2. **MongoDB Instance** (Local or Cloud like Atlas)
3. **Expo Go App** (on your physical device or emulator)

### Step 1: Backend Setup ( `backend`)

1. Navigate to the backend directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the backend directory and add your configuration variables:
    ```text
    MONGODB_URI=<Your MongoDB Connection String>
    PORT=3000
    JWT_SECRET=<A long, random string for token signing>
    ```
4. Start the server:
    ```bash
    npm start  # or node server.js
    ```
    The server should output: `MongoDB connected.` and `Server running on port 3000`.

### Step 2: Frontend Setup (`chore-tracker-app`)

1. Navigate to the frontend directory.
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a .env file in the root of the frontend directory and add your configuration variables:
    ```text
    EXPO_PUBLIC_API_URL=<Your machine's LAN IP:PORT>
    // e.g., http://192.168.1.100:3000
    ```
4. Start the Expo application:
    ``` bash
    npx expo start
    ```
5. **Run on Device:** Scan the QR code displayed in your terminal or browser with the Expo Go app on your iPhone or Android device.

If using Android Emulator or Xcode, press 'a' or 'i' after the Metro bundler launched.

## Key Features and Data Flow

### 1. Authentication & Onboarding

**Registration (`/signup`):**
- Users role is defaultly assigned the Member role, or the user can select their role on the Signup screen.

**Role-Based Onboarding (`Signup.js`):**
- After successful registration/login, if the user is a `Supervisor`, they are navigated to `FamilyCreation` screen.
- If the user is a `Member`, they are navigated to `FamilyJoin` screen.

**Password Reset:** Users can reset their password via email and a new password on the `ForgotPassword` screen (using the `/forgot-password` endpoint).

### 2. Family Management

| Feature       | Backend Endpoint       | Logic Summary                                                                 |
|---------------|-----------------------|-------------------------------------------------------------------------------|
| Create Family | `POST /family/create`   | Supervisor creates a family. A unique 6-character `inviteCode` is generated and saved (`models/family.js`, `familyController.js`). Supervisor's `familyId` is set. |
| Join Family   | `POST /family/join`     | Member enters the `inviteCode` to join a family. Member's `familyId` is set.      |
| View Members  | `GET /family/members`   | Retrieves a list of all users belonging to the authenticated user's family.    |

### 3. Chore Management & Tracking

- **Task Creation:** Supervisors can create tasks (`POST /tasks`) and assign them to members (`assignTo field`).

- **User Task List (`TaskList.js`):**
    - Members only see tasks assigned to them (`GET /tasks/my`). Tasks have a status (`Pending`, `For_Approval`, `Completed`, `Rejected`).
    - Supervisors fetch all family members' tasks (`GET /tasks`).

- **Proof Submission (`ProofUpload.js`)**:
    - A member selects a task from the list and navigates to the upload screen.
    - They can capture a photo or select one from the gallery (using `expo-image-picker`).
    - The form sends the image as `multipart/form-data` to the API.
    - **API Endpoint:** `POST /tasks/proof` (uses `upload.single('proofImage')` middleware).
    - **Database Update:** Task status changes to `For_Approval`, and `proofImage` (file path) and `proofNotes` are saved to the Task model.

### 4. Reward & Approval System

- The `User` model tracks a `starTotal`.
- The `Task` model has a `rewardValue` (max 5 stars) and `status`, `proofImage`, `proofNotes`, `completedAt`.
- **Supervisor Approval:** Supervisors review tasks with status `For_Approval` and can approve or reject them.
- **API Endpoint:** `PATCH /tasks/status/:id`
- **Approval Logic (`tasksController.js`):**
    - When the status is set to `Completed`:
        1. The task is marked as `Completed`.
        2. The task's `rewardValue` is retrieved.
        3. The assigned member's `starTotal` is incremented by the `rewardValue`.
    - When the status is set to `Rejected`:
        1. The task is marked as `Rejected`.
        2. The proof fields (`proofImage`, `proofNotes`, `completedAt`) are cleared, allowing the member to resubmit proof.