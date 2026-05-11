# FinSight

A personal finance management web app built with React and Firebase. Track income, expenses, investments, and financial goals — all in one place with real-time data and smart insights.

## Features

- **Dashboard** — Overview of net savings, income vs expenses, doughnut chart for expense breakdown, and AI-generated financial insights
- **Income** — Log and manage income sources with monthly summaries
- **Expenses** — Track and categorize spending, set monthly budgets per category
- **Goals** — Create financial goals with target amounts and track progress over time
- **Investments** — Monitor your investment portfolio with current value, profit/loss, and return percentage
- **Planner** — Plan and manage upcoming financial events

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8 |
| Styling | Tailwind CSS 3, Framer Motion |
| Charts | Chart.js 4, react-chartjs-2 |
| Icons | Lucide React |
| Routing | React Router DOM 7 |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| Analytics | Firebase Analytics |

## Project Structure

```
src/
├── components/
│   ├── layout/        # Layout, Sidebar, MobileNav
│   └── ui/            # Reusable UI components (Card, Button, Input, etc.)
├── contexts/          # React Context for Auth, Income, Expenses, Goals, Investments, Budget
├── firebase/          # Firebase initialization
├── modules/           # Feature pages (Dashboard, Income, Expenses, Goals, Investments, Planner)
├── services/          # Firestore CRUD services per module
└── utils/             # Currency formatting (INR), financial insights generator
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Authentication and Firestore enabled

### Installation

```bash
git clone https://github.com/Indu-Vadana/finsight.git
cd finsight
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project
2. Enable **Email/Password** authentication under Authentication > Sign-in method
3. Create a **Firestore Database** in production mode
4. Copy your Firebase config values into `.env`

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
