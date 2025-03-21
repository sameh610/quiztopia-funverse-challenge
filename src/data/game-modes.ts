
import { GameMode } from "@/components/GameCard";

// Game modes data to be used across the application
export const gameModes: GameMode[] = [
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
