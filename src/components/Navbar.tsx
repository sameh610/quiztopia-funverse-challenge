
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Gamepad, 
  Plus, 
  Home, 
  User, 
  LogIn, 
  Menu, 
  X,
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@clerk/clerk-react";
import { SignOutButton, UserButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLoginClick = () => {
    navigate("/login");
  };

  const renderMobileMenu = () => (
    <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
      isMenuOpen ? "translate-x-0" : "translate-x-full"
    }`}>
      <div className="flex h-full flex-col bg-background">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center space-x-2" onClick={toggleMenu}>
            <Gamepad className="h-8 w-8 text-quiztopia-primary" />
            <span className="text-xl font-bold text-gradient">QuizTopia</span>
          </Link>
          <button onClick={toggleMenu} className="p-2">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col space-y-4 p-4">
          <Link to="/" className="nav-link flex items-center space-x-2" onClick={toggleMenu}>
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link to="/games" className="nav-link flex items-center space-x-2" onClick={toggleMenu}>
            <Gamepad className="h-5 w-5" />
            <span>Games</span>
          </Link>
          
          {isSignedIn ? (
            <>
              <Link to="/leaderboards" className="nav-link flex items-center space-x-2" onClick={toggleMenu}>
                <Trophy className="h-5 w-5" />
                <span>Leaderboards</span>
              </Link>
              <Link to="/create" className="nav-link flex items-center space-x-2" onClick={toggleMenu}>
                <Plus className="h-5 w-5" />
                <span>Create Quiz</span>
              </Link>
              <Link to="/profile" className="nav-link flex items-center space-x-2" onClick={toggleMenu}>
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <SignOutButton>
                <div className="nav-link flex items-center space-x-2 cursor-pointer">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </div>
              </SignOutButton>
            </>
          ) : (
            <div className="nav-link flex items-center space-x-2 cursor-pointer" onClick={() => {
              handleLoginClick();
              toggleMenu();
            }}>
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Gamepad className="h-8 w-8 text-quiztopia-primary" />
          <span className="text-xl font-bold text-gradient">QuizTopia</span>
        </Link>
        
        {isMobile ? (
          <>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Menu className="h-6 w-6" />
            </Button>
            {renderMobileMenu()}
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/games" className="nav-link">Games</Link>
            
            {isSignedIn ? (
              <>
                <Link to="/leaderboards" className="nav-link">Leaderboards</Link>
                <Link to="/create" className="nav-link">Create Quiz</Link>
                <Link to="/profile" className="nav-link">Profile</Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <Button 
                onClick={handleLoginClick}
                className="rounded-full bg-gradient-to-r from-quiztopia-primary to-quiztopia-accent"
              >
                Login
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
