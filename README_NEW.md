# QuizMaster 🏆

A modern, responsive quiz application built with React, Vite, and Tailwind CSS. Test your knowledge across various categories with an intuitive and engaging interface.

## Features

### 🎯 Quiz Setup
- **Customizable Questions**: Choose between 5-50 questions
- **Multiple Categories**: Science, General Knowledge, Mathematics, History, Geography, Sports, Entertainment
- **Difficulty Levels**: Easy, Medium, Hard
- **Question Types**: Multiple Choice, True/False, Mixed
- **Beautiful UI**: Modern dark theme with gradient accents

### 📝 Quiz Experience
- **Real-time Timer**: 30-second countdown per question
- **Progress Tracking**: Visual progress bar and completion percentage
- **Interactive Answers**: Click to select, visual feedback for correct/incorrect
- **Score Tracking**: Live score updates throughout the quiz
- **Responsive Design**: Works seamlessly on desktop and mobile

### 🎉 Results & Completion
- **Detailed Results**: Score, accuracy percentage, and letter grade
- **Performance Feedback**: Motivational messages based on performance
- **Score Saving**: Save your score to a leaderboard (UI only)
- **Replay Options**: Play again or return to setup

## Tech Stack

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **JavaScript (ES6+)** - Modern JavaScript features

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Fsoc-level-hard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in terminal)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── QuizSetup.jsx      # Quiz configuration screen
│   ├── QuizQuestion.jsx   # Question display and interaction
│   └── QuizComplete.jsx   # Results and completion screen
├── App.jsx                # Main app component and routing
├── index.css              # Global styles and animations
└── main.jsx               # App entry point
```

## Components Overview

### QuizSetup
- Configuration interface for quiz parameters
- Slider for question count selection
- Dropdown menus for category, difficulty, and type
- Visual preview of selected settings

### QuizQuestion
- Question display with timer
- Multiple choice answer options
- Progress tracking
- Immediate feedback on answer selection
- Auto-advance to next question

### QuizComplete
- Final score and statistics
- Grade calculation and display
- Score saving interface (UI only)
- Options to replay or return to setup

## Design Features

- **Dark Theme**: Modern dark color scheme with purple/blue accents
- **Gradient Elements**: Beautiful gradient buttons and progress bars
- **Smooth Animations**: Transitions and hover effects
- **Responsive Layout**: Mobile-first design approach
- **Visual Feedback**: Color-coded answers and results
- **Typography**: Clean, readable font hierarchy

## Customization

### Adding New Categories
Edit the `categories` array in `QuizSetup.jsx`:
```javascript
const categories = [
  'Your New Category',
  // ... existing categories
]
```

### Modifying Questions
Update the `sampleQuestions` array in `QuizQuestion.jsx` with your own questions:
```javascript
const sampleQuestions = [
  {
    question: "Your question here?",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    correctAnswer: 0, // Index of correct answer
    difficulty: "Easy",
    category: "Your Category"
  }
]
```

### Styling Changes
Modify Tailwind classes throughout the components or add custom CSS to `index.css`.

## Future Enhancements

- [ ] Integration with trivia API (Open Trivia Database)
- [ ] Real backend for score persistence
- [ ] User authentication and profiles
- [ ] Leaderboard functionality
- [ ] More question types (fill-in-the-blank, matching)
- [ ] Multiplayer support
- [ ] Achievement system
- [ ] Question difficulty adaptation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspired by modern quiz applications
- Icons and emojis for enhanced user experience
- Tailwind CSS for rapid styling
- React community for excellent documentation