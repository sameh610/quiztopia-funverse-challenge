
import {
  BookOpen,
  Upload,
  Share2,
  ListChecks,
  Users,
  UserPlus,
  Bot,
  Mic,
  Trophy,
  Zap,
  Palette,
  BarChart,
  Globe,
  Moon,
  FileType,
  Headphones
} from "lucide-react";

const features = [
  {
    title: "Question Bank & Game Creator",
    items: [
      { icon: <BookOpen className="h-5 w-5" />, text: "Create custom questions for any game mode" },
      { icon: <Upload className="h-5 w-5" />, text: "Import or generate questions with AI assistance" },
      { icon: <Share2 className="h-5 w-5" />, text: "Share your quizzes or keep them private" },
      { icon: <ListChecks className="h-5 w-5" />, text: "Multiple question types including MCQs, True/False, and more" }
    ]
  },
  {
    title: "Game Hosting & Multiplayer",
    items: [
      { icon: <Users className="h-5 w-5" />, text: "Host real-time quizzes for classrooms or competitions" },
      { icon: <UserPlus className="h-5 w-5" />, text: "Play solo, with friends, or in teams" },
      { icon: <Bot className="h-5 w-5" />, text: "Practice with AI-powered opponents anytime" },
      { icon: <Mic className="h-5 w-5" />, text: "Voice-activated questions for accessibility" }
    ]
  },
  {
    title: "Rewards & Progression",
    items: [
      { icon: <Trophy className="h-5 w-5" />, text: "Earn XP and virtual coins for playing games" },
      { icon: <Zap className="h-5 w-5" />, text: "Use power-ups like extra time, skips, or double points" },
      { icon: <Palette className="h-5 w-5" />, text: "Unlock custom avatars and theme customizations" },
      { icon: <BarChart className="h-5 w-5" />, text: "Track progress with global and private leaderboards" }
    ]
  },
  {
    title: "Accessibility & Cross-Platform",
    items: [
      { icon: <Globe className="h-5 w-5" />, text: "Play on web, mobile, and tablet devices" },
      { icon: <Moon className="h-5 w-5" />, text: "Toggle between dark and light mode themes" },
      { icon: <FileType className="h-5 w-5" />, text: "Support for multiple languages" },
      { icon: <Headphones className="h-5 w-5" />, text: "Text-to-speech and voice control options" }
    ]
  }
];

const FeaturesSection = () => {
  return (
    <section className="bg-pattern py-16">
      <div className="container px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold">
            Powerful <span className="text-gradient">Features</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            QuizTopia combines educational content with addictive gameplay, offering a complete
            learning and gaming experience for students, teachers, and casual players alike.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="mb-4 text-center text-xl font-bold text-gradient">{feature.title}</h3>
              <ul className="space-y-4">
                {feature.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 text-quiztopia-primary">{item.icon}</div>
                    <span className="text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
