
import { useState } from "react";
import { 
  Gamepad, 
  Swords, 
  UserGroup, 
  Code, 
  Car, 
  Store 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import GameCard, { GameMode } from "@/components/GameCard";

// Game modes data
const gameModes: GameMode[] = [
  {
    id: "classic-quiz-battle",
    name: "Classic Quiz Battle",
    description: "Answer questions quickly to earn points. The player with the most points wins!",
    icon: "gamepad",
    category: "classic",
    players: "2-20 players",
    difficulty: "easy"
  },
  {
    id: "duel-mode",
    name: "1v1 Duel Mode",
    description: "Face off against another player in a battle of knowledge and quick thinking.",
    icon: "sword",
    category: "classic",
    players: "2 players",
    difficulty: "medium"
  },
  {
    id: "timed-challenge",
    name: "Timed Challenge",
    description: "Race against the clock! Answer as many questions as possible before time runs out.",
    icon: "timer",
    category: "classic",
    players: "1-10 players",
    difficulty: "medium"
  },
  {
    id: "sudden-death",
    name: "Sudden Death",
    description: "One wrong answer and you're out! Last player standing wins.",
    icon: "skull",
    category: "classic",
    players: "2-15 players",
    difficulty: "hard"
  },
  {
    id: "team-battle",
    name: "Team Battle",
    description: "Form teams and compete together. Collaboration is key to victory!",
    icon: "users",
    category: "classic",
    players: "4-30 players",
    difficulty: "medium"
  },
  {
    id: "tower-defense",
    name: "Tower Defense",
    description: "Answer correctly to build and upgrade defenses against waves of enemies.",
    icon: "building",
    category: "strategy",
    players: "1-4 players",
    difficulty: "medium",
    comingSoon: true
  },
  {
    id: "conquer-map",
    name: "Conquer the Map",
    description: "Claim territories by answering questions correctly. Dominate the map to win!",
    icon: "map",
    category: "strategy",
    players: "2-8 players",
    difficulty: "hard",
    comingSoon: true
  },
  {
    id: "battle-royale",
    name: "Battle Royale",
    description: "100 players enter, but only one can win! Survive to the end by answering correctly.",
    icon: "trophy",
    category: "competitive",
    players: "Up to 100 players",
    difficulty: "expert",
    comingSoon: true
  },
  {
    id: "capture-flag",
    name: "Capture the Flag",
    description: "Answer questions to steal flags from opponents. The team with most flags wins!",
    icon: "flag",
    category: "competitive",
    players: "4-20 players",
    difficulty: "hard",
    comingSoon: true
  },
  {
    id: "code-breaker",
    name: "Code Breaker",
    description: "Crack secret codes by answering logic questions correctly.",
    icon: "code",
    category: "coding",
    players: "1-6 players",
    difficulty: "expert",
    comingSoon: true
  },
  {
    id: "race-finish",
    name: "Race to the Finish",
    description: "Answer questions correctly to advance in a race to the finish line.",
    icon: "car",
    category: "racing",
    players: "2-8 players",
    difficulty: "medium",
    comingSoon: true
  },
  {
    id: "restaurant-tycoon",
    name: "Restaurant Tycoon",
    description: "Build and manage your restaurant empire by answering business questions.",
    icon: "factory",
    category: "economy",
    players: "1-4 players",
    difficulty: "hard",
    comingSoon: true
  }
];

const GameModesSection = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredGames = activeTab === "all" 
    ? gameModes 
    : gameModes.filter(game => game.category === activeTab);

  const categoryIcons = {
    all: <Gamepad className="mr-2 h-4 w-4" />,
    classic: <Gamepad className="mr-2 h-4 w-4" />,
    strategy: <Swords className="mr-2 h-4 w-4" />,
    competitive: <UserGroup className="mr-2 h-4 w-4" />,
    coding: <Code className="mr-2 h-4 w-4" />,
    racing: <Car className="mr-2 h-4 w-4" />,
    economy: <Store className="mr-2 h-4 w-4" />
  };

  return (
    <section className="py-12">
      <div className="container px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">
            Explore <span className="text-gradient">Game Modes</span>
          </h2>
          <p className="mt-2 text-muted-foreground">
            Discover our massive collection of educational game modes
          </p>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-8 flex justify-center">
            <ScrollArea className="w-full max-w-3xl">
              <TabsList className="flex w-full justify-between">
                <TabsTrigger value="all" className="flex items-center">
                  {categoryIcons.all} All Games
                </TabsTrigger>
                <TabsTrigger value="classic" className="flex items-center">
                  {categoryIcons.classic} Classic
                </TabsTrigger>
                <TabsTrigger value="strategy" className="flex items-center">
                  {categoryIcons.strategy} Strategy
                </TabsTrigger>
                <TabsTrigger value="competitive" className="flex items-center">
                  {categoryIcons.competitive} Competitive
                </TabsTrigger>
                <TabsTrigger value="coding" className="flex items-center">
                  {categoryIcons.coding} Coding
                </TabsTrigger>
                <TabsTrigger value="racing" className="flex items-center">
                  {categoryIcons.racing} Racing
                </TabsTrigger>
                <TabsTrigger value="economy" className="flex items-center">
                  {categoryIcons.economy} Economy
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default GameModesSection;
