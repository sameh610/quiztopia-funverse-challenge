
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import GameModesSection from "@/components/GameModesSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        <HeroSection />
        
        <GameModesSection />
        
        <FeaturesSection />
        
        <TestimonialsSection />
        
        {/* Call to Action */}
        <section className="py-16">
          <div className="container px-4 text-center">
            <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-r from-quiztopia-primary to-quiztopia-accent p-10 text-white">
              <h2 className="mb-4 text-3xl font-bold">
                Ready to start your learning adventure?
              </h2>
              <p className="mb-8 text-lg">
                Join thousands of teachers and students already using QuizTopia to make learning fun!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/create">
                  <Button
                    size="lg"
                    className="rounded-xl border-2 border-white bg-white/10 backdrop-blur-md hover:bg-white/20"
                  >
                    Create Your First Quiz <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/games">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-xl border-2 border-white bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                  >
                    Explore Game Modes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
