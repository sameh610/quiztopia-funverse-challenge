
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy } from "lucide-react";

const Leaderboards = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-gradient">Leaderboards</span>
          </h1>
          <p className="text-muted-foreground">
            See who's topping the charts in our quiz competitions
          </p>
        </div>
        
        <div className="rounded-lg border p-8 text-center">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-quiztopia-primary" />
          <h2 className="text-2xl font-bold">Leaderboards Coming Soon</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            We're working on implementing global and game-specific leaderboards. 
            Check back soon to see where you rank among other players!
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboards;
