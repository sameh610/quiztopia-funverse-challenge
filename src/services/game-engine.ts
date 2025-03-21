
import { GameMode } from "@/components/GameCard";

// Define question and game state interfaces
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit?: number;
  points: number;
  category?: string;
  difficulty?: string;
}

export interface Player {
  id: string;
  name: string;
  isReady: boolean;
  score: number;
  avatar?: string;
  isHost?: boolean;
}

export interface GameState {
  gameId: string;
  gameMode: GameMode;
  players: Player[];
  questions: Question[];
  currentQuestionIndex: number;
  timePerQuestion: number;
  timeRemaining: number;
  isGameStarted: boolean;
  isGameOver: boolean;
  winningPlayerId?: string;
}

// Mock questions for different categories
const generalKnowledgeQuestions: Question[] = [
  {
    id: "gk1",
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: 2,
    points: 100,
    category: "Geography",
    difficulty: "easy"
  },
  {
    id: "gk2",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    points: 100,
    category: "Astronomy",
    difficulty: "easy"
  },
  {
    id: "gk3",
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    points: 150,
    category: "Art",
    difficulty: "medium"
  },
  {
    id: "gk4",
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
    points: 100,
    category: "Geography",
    difficulty: "easy"
  },
  {
    id: "gk5",
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
    correctAnswer: 1,
    points: 100,
    category: "Science",
    difficulty: "easy"
  },
  {
    id: "gk6",
    question: "In which year did World War II end?",
    options: ["1943", "1945", "1947", "1950"],
    correctAnswer: 1,
    points: 150,
    category: "History",
    difficulty: "medium"
  },
  {
    id: "gk7",
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1,
    points: 100,
    category: "Biology",
    difficulty: "easy"
  },
  {
    id: "gk8",
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"],
    correctAnswer: 2,
    points: 100,
    category: "Literature",
    difficulty: "easy"
  },
  {
    id: "gk9",
    question: "What is the currency of Japan?",
    options: ["Yuan", "Won", "Yen", "Ringgit"],
    correctAnswer: 2,
    points: 100,
    category: "Geography",
    difficulty: "easy"
  },
  {
    id: "gk10",
    question: "Which of these is not a programming language?",
    options: ["Java", "Python", "Cobra", "Crocodile"],
    correctAnswer: 3,
    points: 200,
    category: "Technology",
    difficulty: "medium"
  }
];

const scienceQuestions: Question[] = [
  {
    id: "sci1",
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Au", "Ag", "Gd"],
    correctAnswer: 1,
    points: 100,
    category: "Chemistry",
    difficulty: "easy"
  },
  {
    id: "sci2",
    question: "Which of the following is not a state of matter?",
    options: ["Solid", "Liquid", "Gas", "Energy"],
    correctAnswer: 3,
    points: 150,
    category: "Physics",
    difficulty: "medium"
  },
  {
    id: "sci3",
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic reticulum"],
    correctAnswer: 1,
    points: 100,
    category: "Biology",
    difficulty: "easy"
  },
  {
    id: "sci4",
    question: "Which planet has the most moons?",
    options: ["Jupiter", "Saturn", "Neptune", "Uranus"],
    correctAnswer: 1,
    points: 200,
    category: "Astronomy",
    difficulty: "hard"
  },
  {
    id: "sci5",
    question: "What is the speed of light?",
    options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000,000 km/s"],
    correctAnswer: 0,
    points: 150,
    category: "Physics",
    difficulty: "medium"
  }
];

const historyQuestions: Question[] = [
  {
    id: "hist1",
    question: "Which year did Christopher Columbus first arrive in the Americas?",
    options: ["1492", "1500", "1512", "1592"],
    correctAnswer: 0,
    points: 150,
    category: "Exploration",
    difficulty: "medium"
  },
  {
    id: "hist2",
    question: "Who was the first President of the United States?",
    options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
    correctAnswer: 2,
    points: 100,
    category: "Politics",
    difficulty: "easy"
  },
  {
    id: "hist3",
    question: "The French Revolution began in which year?",
    options: ["1789", "1799", "1769", "1779"],
    correctAnswer: 0,
    points: 200,
    category: "Revolution",
    difficulty: "hard"
  },
  {
    id: "hist4",
    question: "Who discovered penicillin?",
    options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Joseph Lister"],
    correctAnswer: 1,
    points: 150,
    category: "Medicine",
    difficulty: "medium"
  },
  {
    id: "hist5",
    question: "Which ancient civilization built the Machu Picchu?",
    options: ["Incas", "Aztecs", "Mayans", "Olmecs"],
    correctAnswer: 0,
    points: 150,
    category: "Ancient History",
    difficulty: "medium"
  }
];

// Get questions for a game mode
export const getQuestionsForGame = (gameId: string): Question[] => {
  if (gameId.includes('science')) {
    return [...scienceQuestions, ...generalKnowledgeQuestions.slice(0, 5)];
  } else if (gameId.includes('history')) {
    return [...historyQuestions, ...generalKnowledgeQuestions.slice(5, 10)];
  } else {
    // Default to general knowledge
    return generalKnowledgeQuestions;
  }
};

// Initialize a new game
export const initializeGame = (gameId: string, gameMode: GameMode, host: Player): GameState => {
  return {
    gameId,
    gameMode,
    players: [{ ...host, isHost: true, isReady: true }],
    questions: getQuestionsForGame(gameId),
    currentQuestionIndex: 0,
    timePerQuestion: 20, // Default time per question in seconds
    timeRemaining: 20,
    isGameStarted: false,
    isGameOver: false
  };
};

// Check if all players are ready
export const areAllPlayersReady = (players: Player[]): boolean => {
  return players.every(player => player.isReady);
};

// Calculate points based on time remaining and question difficulty
export const calculatePoints = (question: Question, timeRemaining: number, timePerQuestion: number): number => {
  // Base points for the question
  const basePoints = question.points;
  
  // Time bonus: up to 50% extra for fast answers
  const timeBonus = Math.round((timeRemaining / timePerQuestion) * (basePoints * 0.5));
  
  return basePoints + timeBonus;
};

// Find the winner of the game
export const determineWinner = (players: Player[]): Player | null => {
  if (players.length === 0) return null;
  
  return players.reduce((winner, player) => {
    return player.score > winner.score ? player : winner;
  }, players[0]);
};

// Generate a unique game code
export const generateGameCode = (): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Creates AI players with mock data
export const createAIPlayers = (count: number): Player[] => {
  const aiNames = [
    "QuizBot", "BrainBot", "TriviaAI", "SmartBot", 
    "QuizMaster", "KnowledgeBot", "FactFinder", "DataBot"
  ];
  
  return Array.from({ length: count }).map((_, index) => ({
    id: `ai-${index + 1}`,
    name: aiNames[index % aiNames.length] + " " + (index + 1),
    isReady: true,
    score: 0
  }));
};
