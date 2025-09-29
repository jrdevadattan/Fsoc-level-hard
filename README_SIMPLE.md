# Simple Quiz App

A beginner-friendly React quiz application perfect for first-year students to learn from!

## What is this?

This is a simple quiz app built with React that demonstrates:
- Basic React components
- State management with hooks (useState)
- React Router for navigation between pages
- Context API for sharing data between components
- Simple CSS styling

## How it works

The app has 3 main pages:
1. **Setup Page** (`/`) - Choose how many questions you want
2. **Quiz Page** (`/quiz`) - Answer the questions one by one
3. **Results Page** (`/results`) - See your final score

## Files and what they do

### Main files:
- `src/App.jsx` - Main app component with routing and shared state
- `src/main.jsx` - Entry point that renders the app

### Components:
- `src/components/QuizSetup.jsx` - The setup page
- `src/components/QuizQuestion.jsx` - Shows quiz questions
- `src/components/QuizComplete.jsx` - Shows final results

### Styling:
- `src/index.css` - Simple CSS styles

## How to run

1. Make sure you have Node.js installed
2. Install dependencies: `npm install`
3. Start the app: `npm run dev`
4. Open your browser to the URL shown (usually http://localhost:5173)

## What you can learn

### React Concepts:
- **Components**: Each part of the app is a separate component
- **Props**: How components receive data from their parents
- **State**: How components remember and change data
- **Hooks**: Special functions like `useState` and `useContext`
- **Context**: How to share data between all components

### React Router:
- **BrowserRouter**: Enables routing in the app
- **Routes & Route**: Define which component shows for each URL
- **useNavigate**: How to move between pages programmatically

### JavaScript Concepts:
- **Arrow functions**: Modern way to write functions
- **Array methods**: Like `map()` to create lists
- **Object destructuring**: Getting values from objects easily
- **Template literals**: Using `${}` inside strings

## Try modifying it!

Here are some easy changes you can make:
1. Add more questions to the `questions` array
2. Change the colors in the inline styles
3. Add more answer options to questions
4. Change the number of questions allowed
5. Add different categories of questions

## Code Structure

```
src/
├── App.jsx           (Main app with routing)
├── main.jsx          (App entry point)
├── index.css         (Simple styles)
└── components/
    ├── QuizSetup.jsx    (Setup page)
    ├── QuizQuestion.jsx (Question page)  
    └── QuizComplete.jsx (Results page)
```

This is a great starting project for learning React! The code is written to be as simple and clear as possible.