
import { Link } from "react-router-dom";
import { 
  GameController, 
  Timer, 
  Sword, 
  Skull, 
  Users, 
  ArrowRight, 
  Flag,
  Trophy,
  Map,
  Building,
  Factory,
  Lock,
  User,
  Network,
  Code,
  Zap,
  Car,
  Rocket,
  Plane,
  Maze,
  Planet,
  Train
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type GameMode = {
  id: string;
  name: string;
  description: string;
  icon: string;
  comingSoon?: boolean;
  category: "classic" | "strategy" | "competitive" | "coding" | "racing" | "economy" | "experimental";
  players: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
};

interface GameCardProps {
  game: GameMode;
}

const GameCard = ({ game }: GameCardProps) => {
  // Map of icon names to Lucide icon components
  const iconMap: Record<string, React.ReactNode> = {
    'gamepad': <GameController className="h-6 w-6" />,
    'timer': <Timer className="h-6 w-6" />,
    'sword': <Sword className="h-6 w-6" />,
    'skull': <Skull className="h-6 w-6" />,
    'users': <Users className="h-6 w-6" />,
    'flag': <Flag className="h-6 w-6" />,
    'trophy': <Trophy className="h-6 w-6" />,
    'map': <Map className="h-6 w-6" />,
    'building': <Building className="h-6 w-6" />,
    'factory': <Factory className="h-6 w-6" />,
    'lock': <Lock className="h-6 w-6" />,
    'user': <User className="h-6 w-6" />,
    'network': <Network className="h-6 w-6" />,
    'code': <Code className="h-6 w-6" />,
    'zap': <Zap className="h-6 w-6" />,
    'car': <Car className="h-6 w-6" />,
    'rocket': <Rocket className="h-6 w-6" />,
    'plane': <Plane className="h-6 w-6" />,
    'maze': <Maze className="h-6 w-6" />,
    'planet': <Planet className="h-6 w-6" />,
    'train': <Train className="h-6 w-6" />
  };

  // Map of difficulty to color scheme
  const difficultyColorMap = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    hard: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    expert: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  };
  
  const categoryColorMap = {
    classic: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    strategy: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    competitive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    coding: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
    racing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    economy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    experimental: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100"
  };

  return (
    <div className="game-card group h-full">
      {game.comingSoon && (
        <div className="absolute right-0 top-0 z-10 rounded-bl-lg bg-quiztopia-accent px-3 py-1 text-xs font-bold text-white">
          Coming Soon
        </div>
      )}
      
      <div className="flex h-full flex-col p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="game-icon">
            {iconMap[game.icon] || <GameController className="h-6 w-6" />}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={difficultyColorMap[game.difficulty]}>
              {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
            </Badge>
            <Badge variant="outline" className={categoryColorMap[game.category]}>
              {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
            </Badge>
          </div>
        </div>
        
        <h3 className="mb-2 text-xl font-bold">{game.name}</h3>
        <p className="mb-4 flex-grow text-sm text-muted-foreground">{game.description}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{game.players}</span>
          
          {game.comingSoon ? (
            <Button disabled variant="outline" size="sm" className="text-xs">
              Locked <Lock className="ml-1 h-3 w-3" />
            </Button>
          ) : (
            <Link to={`/play/${game.id}`}>
              <Button size="sm" className="group bg-quiztopia-primary hover:bg-quiztopia-primary/90">
                Play Now
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
