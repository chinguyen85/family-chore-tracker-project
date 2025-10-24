Family Chore Tracker App
This project is a full-stack family chore management application designed to help family members organize, assign, track, and get rewarded for household tasks. It features a React Native (Expo) mobile application for the frontend and a RESTful API built with Node.js/Express and MongoDB for the backend.
🛠️ Tech Stack




Component
Technology
Role / Purpose



Frontend
React Native (Expo)
Cross-platform mobile client application.


Backend (API)
Node.js, Express
Provides authenticated RESTful services.


Database
MongoDB (Mongoose)
Data persistence for Users, Families, and Tasks.


Authentication
JWT, Bcrypt
Secures user login and protects API routes (auth.js middleware).


File Handling
Multer, Expo ImagePicker
Handles image uploads for task proof submission (ProofUpload.js, upload.js).


Navigation
React Navigation
Manages app flow (AuthNavigator.js, MainNavigator.js).


🚀 How to Run the Project
Prerequisites
Ensure you have the following installed:

Node.js (v18+) and npm
MongoDB Instance (Local or Cloud like Atlas)
Expo Go App (on your physical device or emulator)
Expo CLI (npm install -g expo-cli)

Step 1: Backend Setup (e.g., chore-tracker-api)

Navigate to the backend directory.
Install dependencies:npm install


Create a .env file in the root of the backend directory and add your configuration variables:MONGODB_URI=<Your MongoDB Connection String>
PORT=3000
JWT_SECRET=<A long, random string for token signing>


Start the server:npm start  # or node server.js

The server should output: MongoDB connected. and Server running on port 3000.

Step 2: Frontend Setup (e.g., chore-tracker-app)

Navigate to the frontend directory.
Install dependencies:npm install


Configure API URL: Update the BASE_URL in services/app.js to point to your backend.
If testing on a physical device, replace localhost with your computer's Local Area Network (LAN) IP address (e.g., http://192.168.1.100:3000).


Start the Expo application:npx expo start


Run on Device: Scan the QR code displayed in your terminal with the Expo Go app to launch the mobile client.

🔑 Key Features and Data Flow
1. Authentication & Onboarding

Registration (/signup):
The first user to register is automatically assigned the Supervisor role (authController.js).
Subsequent users are assigned the Member role, or the user can select their role on the Signup screen.


Role-Based Onboarding (Signup.js):
After successful registration/login, if the user is a Supervisor, they are navigated to FamilyCreation.
If the user is a Member, they are navigated to FamilyJoin.


Password Reset: Users can reset their password via email and a new password on the ForgotPassword screen (using the /forgot-password endpoint).

2. Family Management



Feature
Backend Endpoint
Logic Summary



Create Family
POST /family/create
Supervisor creates a family. A unique 6-character inviteCode is generated and saved (models/family.js, familyController.js). Supervisor's familyId is set.


Join Family
POST /family/join
Member enters the inviteCode to join a family. Member's familyId is set.


View Members
GET /family/members
Retrieves a list of all users belonging to the authenticated user's family.


3. Chore Management & Tracking

Task Creation: Supervisors can create tasks (POST /tasks) and assign them to members (assignTo field).
User Task List (TaskList.js): Members only see tasks assigned to them (GET /tasks/my). Tasks have a status (Pending, For_Approval, Completed, Rejected).
Proof Submission (ProofUpload.js):
A member selects a task from the list and navigates to the upload screen.
They can capture a photo or select one from the gallery (using expo-image-picker).
The form sends the image as multipart/form-data to the API.
API Endpoint: POST /tasks/proof (uses upload.single('proofImage') middleware).
Database Update: Task status changes to For_Approval, and proofImage (file path) and proofNotes are saved to the Task model.



4. Reward System

The User model tracks a starTotal.
The Task model has a rewardValue (max 5 stars).
Note: The final logic for a Supervisor to approve a task (which would change the task status from For_Approval to Completed and update the member's starTotal) is the intended final step in the workflow.