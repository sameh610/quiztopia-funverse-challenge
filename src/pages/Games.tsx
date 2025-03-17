
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GameCard, { GameMode } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  SlidersHorizontal, 
  X,
  FilterX 
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

// Import game modes data (same as in GameModesSection)
// This would typically be in a separate data file that both components import
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

const Games = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  const toggleFilters = () => setFiltersVisible(!filtersVisible);
  
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedDifficulty("");
  };
  
  // Apply filters to game modes
  const filteredGames = gameModes.filter((game) => {
    // Search query filter
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory ? game.category === selectedCategory : true;
    
    // Difficulty filter
    const matchesDifficulty = selectedDifficulty ? game.difficulty === selectedDifficulty : true;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  
  const anyFiltersActive = searchQuery || selectedCategory || selectedDifficulty;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Game <span className="text-gradient">Library</span>
          </h1>
          <p className="text-muted-foreground">
            Explore our collection of educational game modes for every learning style
          </p>
        </div>
        
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Button
            variant={filtersVisible ? "default" : "outline"}
            onClick={toggleFilters}
            className="flex-shrink-0"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
        
        {filtersVisible && (
          <div className="mb-8 rounded-lg border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Filter Games</h3>
              {anyFiltersActive && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <FilterX className="mr-1 h-4 w-4" />
                  Clear all filters
                </Button>
              )}
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="strategy">Strategy</SelectItem>
                    <SelectItem value="competitive">Competitive</SelectItem>
                    <SelectItem value="coding">Coding</SelectItem>
                    <SelectItem value="racing">Racing</SelectItem>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="experimental">Experimental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
        
        {filteredGames.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No games found</h3>
            <p className="mb-4 max-w-md text-muted-foreground">
              We couldn't find any games matching your current filters. Try adjusting your search or filters.
            </p>
            <Button onClick={clearFilters}>Clear all filters</Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Games;
