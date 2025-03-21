
import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Gamepad, 
  Users, 
  ChevronLeft, 
  Timer,
  Settings,
  Play,
  Info,
  Check,
  ChevronRight,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { AlertLocked, AlertInfo } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";
import { 
  initializeGame, 
  createAIPlayers, 
  areAllPlayersReady, 
  calculatePoints, 
  determineWinner,
  generateGameCode,
  Player,
  GameState,
  Question
} from "@/services/game-engine";
import { GameMode } from "@/components/GameCard";
import { gameModes } from "@/data/game-modes";

// Import mock quiz data to display later
const mockQuizData = {
  title: "General Knowledge Quiz",
  questions: [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      answer: 2,
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      answer: 1,
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      answer: 2,
    },
  ],
};

const PlayGame = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { toast } = useToast();
  const { isLoggedIn, user, updatePoints } = useAuth();
  const navigate = useNavigate();
  
  // Game state
  const [isLobby, setIsLobby] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [gameCode] = useState(generateGameCode());
  
  // Refs
  const timerRef = useRef<number | null>(null);
  const resultsTimeoutRef = useRef<number | null>(null);
  
  // Find the current game mode based on gameId
  const currentGameMode = gameModes.find(mode => mode.id === gameId) || gameModes[0];
  
  // Initialize game state on component mount
  useEffect(() => {
    if (!isLoggedIn || !user) {
      toast({
        title: "Login Required",
        description: "Please log in to play games",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    
    const currentPlayer: Player = {
      id: user.id,
      name: user.name,
      isReady: true,
      score: 0,
      avatar: user.avatar
    };
    
    // Initialize the game with the current player and add AI players
    const initialGameState = initializeGame(
      gameId || "classic-quiz-battle",
      currentGameMode,
      currentPlayer
    );
    
    // Add 2-5 AI players
    const aiPlayerCount = Math.floor(Math.random() * 4) + 2;
    const aiPlayers = createAIPlayers(aiPlayerCount);
    initialGameState.players = [...initialGameState.players, ...aiPlayers];
    
    setGameState(initialGameState);
    
    toast({
      title: "Game Loaded",
      description: `Now playing: ${gameId?.replace(/-/g, " ")}`,
    });
    
    return () => {
      // Clean up timers
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (resultsTimeoutRef.current) window.clearTimeout(resultsTimeoutRef.current);
    };
  }, [gameId, isLoggedIn, navigate, toast, user, currentGameMode]);
  
  const handleStartGame = () => {
    if (!gameState) return;
    
    if (!areAllPlayersReady(gameState.players)) {
      toast({
        title: "Not all players are ready",
        description: "Wait for all players to be ready before starting",
        variant: "destructive",
      });
      return;
    }
    
    setIsLobby(false);
    setGameState(prev => prev ? { ...prev, isGameStarted: true } : null);
    
    // Start the timer
    startTimer();
    
    toast({
      title: "Game Started!",
      description: "Good luck!",
    });
  };
  
  const startTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    
    setTimeRemaining(gameState?.timePerQuestion || 20);
    
    timerRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - if no answer selected, count as wrong
          if (!isAnswered) {
            handleAnswerSelected(null);
          }
          window.clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const handleAnswerSelected = (optionIndex: number | null) => {
    if (!gameState || isAnswered) return;
    
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    // Stop the timer
    if (timerRef.current) window.clearInterval(timerRef.current);
    
    // Calculate points if correct
    let pointsEarned = 0;
    if (isCorrect) {
      pointsEarned = calculatePoints(currentQuestion, timeRemaining, gameState.timePerQuestion);
      
      // Update player score
      setGameState(prev => {
        if (!prev) return null;
        
        const updatedPlayers = prev.players.map(player => {
          if (player.id === user?.id) {
            return { ...player, score: player.score + pointsEarned };
          }
          // AI players get random scores based on difficulty
          if (player.id.startsWith('ai-')) {
            const aiCorrect = Math.random() > 0.3; // 70% chance to be correct
            const aiPoints = aiCorrect ? Math.floor(Math.random() * 200) + 50 : 0;
            return { ...player, score: player.score + aiPoints };
          }
          return player;
        });
        
        return { ...prev, players: updatedPlayers };
      });
      
      // Show confetti for correct answers
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast({
        title: "Correct!",
        description: `You earned ${pointsEarned} points`,
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Better luck on the next question!",
        variant: "destructive",
      });
    }
    
    // Wait a moment before moving to the next question
    resultsTimeoutRef.current = window.setTimeout(() => {
      // Move to the next question or end the game
      if (gameState.currentQuestionIndex >= gameState.questions.length - 1) {
        endGame(pointsEarned);
      } else {
        nextQuestion(pointsEarned);
      }
    }, 2000);
  };
  
  const nextQuestion = (pointsEarned: number) => {
    setSelectedOption(null);
    setIsAnswered(false);
    
    setGameState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      };
    });
    
    // Start the timer for the next question
    startTimer();
  };
  
  const endGame = (finalPoints: number) => {
    if (!gameState) return;
    
    setIsGameOver(true);
    
    // Update the game state
    const winner = determineWinner(gameState.players);
    setGameState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        isGameOver: true,
        winningPlayerId: winner?.id
      };
    });
    
    // Add the points to the user's total
    if (user) {
      updatePoints(finalPoints);
    }
    
    // Show confetti for the winner
    if (winner?.id === user?.id) {
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 }
      });
    }
  };
  
  const restartGame = () => {
    if (!gameState) return;
    
    // Reset game state
    setIsLobby(true);
    setIsGameOver(false);
    setSelectedOption(null);
    setIsAnswered(false);
    
    // Re-initialize game with same players but reset scores
    setGameState(prev => {
      if (!prev) return null;
      
      const resetPlayers = prev.players.map(player => ({
        ...player,
        score: 0,
        isReady: player.id === user?.id  // Only the user is ready
      }));
      
      return {
        ...prev,
        players: resetPlayers,
        currentQuestionIndex: 0,
        isGameStarted: false,
        isGameOver: false,
        winningPlayerId: undefined
      };
    });
    
    toast({
      title: "Game Reset",
      description: "Ready to play again!",
    });
  };
  
  // Get the current question
  const currentQuestion = gameState?.questions[gameState?.currentQuestionIndex || 0];
  
  // Sort players by score (descending)
  const sortedPlayers = gameState?.players.sort((a, b) => b.score - a.score) || [];
  
  // Determine if the user is the winner
  const isUserWinner = gameState?.winningPlayerId === user?.id;
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-8">
        <div className="mb-6 flex items-center gap-2">
          <Link to="/games">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold md:text-3xl">
            {currentGameMode.name}
          </h1>
        </div>
        
        {isLobby ? (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-lg border bg-card">
                <div className="flex items-center justify-between border-b p-4">
                  <h2 className="text-xl font-bold">Game Lobby</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button 
                      className="bg-quiztopia-primary hover:bg-quiztopia-primary/90"
                      onClick={handleStartGame}
                      disabled={!isLoggedIn}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Game
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-4 rounded-md bg-muted p-3">
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm">
                        Share your game code with others to let them join: <span className="font-bold">{gameCode}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {sortedPlayers.map(player => (
                      <div key={player.id} className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold">
                            {player.name.charAt(0)}
                          </div>
                          <span className="font-medium">{player.name}</span>
                          {player.id === user?.id && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
                          {player.isHost && <span className="ml-2 text-xs text-blue-500">(Host)</span>}
                        </div>
                        <div className={`rounded-full px-2 py-0.5 text-xs ${
                          player.isReady 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
                        }`}>
                          {player.isReady ? "Ready" : "Not Ready"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-3 font-semibold">Selected Quiz</h3>
                <div className="flex items-center gap-3 rounded-md bg-muted p-3">
                  <Gamepad className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{currentGameMode.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {gameState?.questions.length || 0} questions
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-3 font-semibold">Game Mode</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 rounded-md bg-muted p-3">
                    <Gamepad className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{currentGameMode.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {currentGameMode.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Players</span>
                      </div>
                      <span className="text-sm font-medium">{sortedPlayers.length}/8</span>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Time per question</span>
                      </div>
                      <span className="text-sm font-medium">{gameState?.timePerQuestion || 20} seconds</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-3 font-semibold">How to Play</h3>
                <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                  <li>Answer questions as quickly as possible</li>
                  <li>Faster answers earn more points</li>
                  <li>The player with the most points at the end wins</li>
                  <li>Use power-ups strategically to gain an advantage</li>
                </ul>
              </div>
            </div>
          </div>
        ) : isGameOver ? (
          // Game over screen
          <div className="mx-auto max-w-3xl rounded-lg border bg-card p-8">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold">Game Over!</h2>
              <p className="text-muted-foreground">
                {isUserWinner 
                  ? "Congratulations! You won the game!" 
                  : "Better luck next time!"}
              </p>
            </div>
            
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold">Final Leaderboard</h3>
              <div className="space-y-3">
                {sortedPlayers.map((player, index) => (
                  <div 
                    key={player.id} 
                    className={`flex items-center justify-between rounded-md border p-4 ${
                      player.id === gameState?.winningPlayerId 
                        ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800" 
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{player.name}</span>
                      {player.id === user?.id && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
                      {player.id === gameState?.winningPlayerId && (
                        <Award className="ml-2 h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <span className="font-bold">{player.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
              <Button onClick={restartGame} className="w-full md:w-auto">
                <Play className="mr-2 h-4 w-4" />
                Play Again
              </Button>
              <Link to="/games">
                <Button variant="outline" className="w-full md:w-auto">
                  Browse More Games
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // Active game interface
          <div className="mx-auto max-w-3xl">
            {/* Question progress */}
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-medium">
                Question {(gameState?.currentQuestionIndex || 0) + 1} of {gameState?.questions.length || 0}
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{timeRemaining}s</span>
              </div>
            </div>
            
            <Progress 
              value={((gameState?.currentQuestionIndex || 0) / (gameState?.questions.length || 1)) * 100} 
              className="mb-6 h-2"
            />
            
            {/* Current question */}
            <div className="mb-8 rounded-lg border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold md:text-2xl">
                {currentQuestion?.question || "Loading question..."}
              </h2>
              
              <div className="grid gap-3 md:grid-cols-2">
                {currentQuestion?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !isAnswered && handleAnswerSelected(index)}
                    disabled={isAnswered}
                    className={`flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                      isAnswered && index === currentQuestion.correctAnswer
                        ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300"
                        : isAnswered && index === selectedOption
                          ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300"
                          : selectedOption === index
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                    }`}
                  >
                    <span>{option}</span>
                    {isAnswered && index === currentQuestion.correctAnswer && (
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Player scores */}
            <div className="mb-4">
              <h3 className="mb-3 font-semibold">Leaderboard</h3>
              <div className="rounded-lg border bg-card">
                <div className="grid grid-cols-3 gap-4 border-b p-3 text-sm font-medium text-muted-foreground">
                  <div>Player</div>
                  <div className="text-center">Score</div>
                  <div className="text-right">Position</div>
                </div>
                
                <div className="max-h-60 overflow-y-auto">
                  {sortedPlayers.map((player, index) => (
                    <div 
                      key={player.id} 
                      className={`grid grid-cols-3 items-center gap-4 border-b p-3 last:border-0 ${
                        player.id === user?.id ? "bg-muted/50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold">
                          {player.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium truncate">{player.name}</span>
                        {player.id === user?.id && <span className="ml-1 text-xs text-muted-foreground">(You)</span>}
                      </div>
                      <div className="text-center font-semibold">{player.score}</div>
                      <div className="text-right text-sm">
                        {index === 0 ? (
                          <span className="text-yellow-500">1st</span>
                        ) : index === 1 ? (
                          <span className="text-slate-400">2nd</span>
                        ) : index === 2 ? (
                          <span className="text-amber-600">3rd</span>
                        ) : (
                          <span className="text-muted-foreground">{index + 1}th</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {isAnswered && (
              <div className="flex justify-end">
                <Button 
                  onClick={() => {
                    if (gameState?.currentQuestionIndex === gameState?.questions.length - 1) {
                      endGame(0);
                    } else {
                      nextQuestion(0);
                    }
                  }}
                  className="gap-2"
                >
                  {gameState?.currentQuestionIndex === gameState?.questions.length - 1 ? (
                    <>See Results</>
                  ) : (
                    <>Next Question<ChevronRight className="h-4 w-4" /></>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PlayGame;
