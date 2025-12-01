# Sugoku - Sudoku Solver Angular Application

A production-ready Sudoku solving application built with Angular 17, featuring a beautiful UI, state management, and full API integration with the Sugoku API.

## Features

- 🎮 **Difficulty Selection**: Choose from Easy, Medium, Hard, or Random difficulty levels
- ✏️ **Interactive Board**: Enter numbers in empty cells (pre-filled cells are protected)
- ✅ **Validation**: Verify your solution with the Validate button
- 🤖 **Auto-Solve**: Automatically solve the puzzle with the Solve button
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 🔄 **State Management**: Centralized state management using RxJS BehaviorSubject
- ⚡ **Production Ready**: TypeScript strict mode, error handling, and loading states

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## API Integration

The application integrates with the Sugoku API:

- **GET** `https://sugoku.onrender.com/board?difficulty={difficulty}` - Fetch a new Sudoku board
- **POST** `https://sugoku.onrender.com/validate` - Validate the current board state
- **POST** `https://sugoku.onrender.com/solve` - Get the solution for the board

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── sudoku-board/
│   │       ├── sudoku-board.component.ts
│   │       ├── sudoku-board.component.html
│   │       └── sudoku-board.component.css
│   ├── models/
│   │   └── sudoku.types.ts
│   ├── services/
│   │   ├── sudoku-api.service.ts
│   │   └── game-state.service.ts
│   ├── app.component.ts
│   ├── app.component.html
│   └── app.component.css
├── index.html
├── main.ts
└── styles.css
```

## Technologies Used

- **Angular 17** - Framework
- **TypeScript** - Type safety
- **RxJS** - Reactive programming and state management
- **CSS3** - Styling with modern features

## Features Implementation

### State Management
- Centralized state management using `GameStateService` with RxJS BehaviorSubject
- Observable pattern for reactive updates across components

### Validation
- Client-side validation prevents editing pre-filled cells
- Server-side validation via API for solution verification
- Visual feedback for solved/broken states

### UX Enhancements
- Loading states during API calls
- Visual feedback for cell states (pre-filled, solved, broken)
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Clear error messages

### Testing Ready
- TypeScript strict mode enabled
- Modular component structure
- Service-based architecture for easy unit testing

## Future Enhancements

Potential features for future development:
- Multiplayer mode
- Timer and scoring system
- Puzzle history and statistics
- Undo/Redo functionality
- Hint system
- Difficulty-specific achievements

## License

This project is open source and available for use.

