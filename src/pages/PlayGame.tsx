
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock quiz data
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
  const { gameId } = useParams();
  const { toast } = useToast();
  const [isLobby, setIsLobby] = useState(true);
  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", isReady: true },
    { id: 2, name: "Player 2", isReady: false },
  ]);
  
  useEffect(() => {
    toast({
      title: "Game Loaded",
      description: `Now playing: ${gameId?.replace(/-/g, " ")}`,
    });
  }, [gameId, toast]);
  
  const handleStartGame = () => {
    if (players.some(player => !player.isReady)) {
      toast({
        title: "Not all players are ready",
        description: "Wait for all players to be ready before starting",
        variant: "destructive",
      });
      return;
    }
    
    setIsLobby(false);
    toast({
      title: "Game Started!",
      description: "Good luck!",
    });
  };
  
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
            {gameId?.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
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
                        Share your game code with others to let them join: <span className="font-bold">XY7Z9P</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {players.map(player => (
                      <div key={player.id} className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold">
                            {player.name.charAt(0)}
                          </div>
                          <span className="font-medium">{player.name}</span>
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
                    <p className="font-medium">{mockQuizData.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {mockQuizData.questions.length} questions
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
                      <p className="font-medium">Classic Quiz Battle</p>
                      <p className="text-sm text-muted-foreground">
                        Answer questions quickly to earn points
                      </p>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Players</span>
                      </div>
                      <span className="text-sm font-medium">{players.length}/8</span>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Time per question</span>
                      </div>
                      <span className="text-sm font-medium">20 seconds</span>
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
        ) : (
          <div className="rounded-lg border p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Game in Progress!</h2>
            <p className="mx-auto mb-6 max-w-md text-muted-foreground">
              The actual game interface would be implemented here. For now, this is a placeholder showing that the game has started.
            </p>
            <Button onClick={() => setIsLobby(true)}>Return to Lobby</Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PlayGame;
