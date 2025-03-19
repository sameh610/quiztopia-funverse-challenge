
import { useState } from "react";
import { Link } from "react-router-dom";
import { Gamepad, BookOpen, Users, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const HeroSection = () => {
  const [gameCode, setGameCode] = useState("");
  const { toast } = useToast();

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameCode.trim()) {
      toast({
        title: "Game code required",
        description: "Please enter a valid game code to join.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Joining game...",
      description: `Attempting to join game with code: ${gameCode}`,
    });
    // Here we'd typically validate the code and redirect to the game
    setGameCode("");
  };

  return (
    <div className="relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 h-64 w-64 animate-spin-slow rounded-full bg-gradient-to-r from-quiztopia-primary/20 to-quiztopia-accent/20 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 h-64 w-64 animate-spin-slow rounded-full bg-gradient-to-r from-quiztopia-accent/20 to-quiztopia-secondary/20 blur-3xl"></div>
      
      <div className="container relative z-10 px-4 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              <span className="text-gradient">QuizTopia:</span> The Ultimate
              <span className="relative">
                <span className="relative z-10"> Educational Gaming</span>
                <span className="absolute bottom-2 left-0 z-0 h-3 w-full bg-quiztopia-secondary/30"></span>
              </span> Platform
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground">
              Learn, play, and compete with the most feature-packed quiz platform ever made. 
              Create your own quizzes or join existing games with friends!
            </p>
            
            <div className="mb-8 flex flex-wrap gap-4">
              <Link to="/create">
                <Button size="lg" className="quiz-button">
                  Create Quiz <BookOpen className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/games">
                <Button size="lg" variant="outline" className="rounded-xl">
                  Browse Games <Gamepad className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <form onSubmit={handleJoinGame} className="flex max-w-md gap-2">
              <Input
                type="text"
                placeholder="Enter game code to join"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
                className="quiz-input"
              />
              <Button type="submit" className="quiz-button">
                Join <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-quiztopia-primary to-quiztopia-accent blur"></div>
              <div className="relative flex flex-col gap-6 rounded-3xl bg-card p-8">
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold">Featured Game Modes</h3>
                  <Link to="/games" className="text-sm font-medium text-quiztopia-primary hover:underline">
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {[
                    { 
                      icon: <Gamepad className="h-5 w-5" />, 
                      title: "Classic Quiz Battle", 
                      description: "Answer quickly to score the most points!" 
                    },
                    { 
                      icon: <Users className="h-5 w-5" />, 
                      title: "Team Battle", 
                      description: "Work together to outsmart other teams!" 
                    },
                    { 
                      icon: <Zap className="h-5 w-5" />, 
                      title: "Tower Defense", 
                      description: "Answer correctly to build & upgrade defenses" 
                    }
                  ].map((mode, i) => (
                    <div key={i} className="flex items-start gap-4 rounded-xl bg-background p-3 transition-colors hover:bg-muted/50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-quiztopia-primary/10 text-quiztopia-primary">
                        {mode.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{mode.title}</h4>
                        <p className="text-sm text-muted-foreground">{mode.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Link to="/play/classic-quiz-battle" className="mt-2">
                  <Button className="w-full bg-quiztopia-primary hover:bg-quiztopia-primary/90">
                    Play Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
