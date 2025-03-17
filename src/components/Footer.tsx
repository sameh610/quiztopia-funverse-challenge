
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-background py-8">
      <div className="container flex flex-col items-center justify-between space-y-4 px-4 md:flex-row md:space-y-0">
        <div className="flex flex-col items-center space-y-2 md:items-start">
          <div className="text-xl font-bold text-gradient">QuizTopia</div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            The most feature-packed educational gaming platform
          </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
            About Us
          </Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
            Terms of Service
          </Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </div>
        
        <div className="flex flex-col items-center space-y-2 text-sm text-muted-foreground md:items-end">
          <div className="flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-quiztopia-danger" />
            <span>for educational fun</span>
          </div>
          <p>© {new Date().getFullYear()} QuizTopia: The Funverse Challenge</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
