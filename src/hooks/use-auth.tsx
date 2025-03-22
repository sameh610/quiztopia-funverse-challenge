
import { useToast } from './use-toast';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar?: string;
  points: number;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  updatePoints: (points: number) => void;
}

// Demo user for when authentication is disabled
const demoUser: User = {
  id: 'demo-user-123',
  name: 'Demo User',
  email: 'demo@example.com',
  initials: 'DU',
  points: 100
};

export const useAuth = (): AuthContextType => {
  const { toast } = useToast();
  
  // Since Clerk is not properly configured, use demo mode
  const user = demoUser;

  const updatePoints = (points: number) => {
    // For demo purposes, show toast but don't update any persistent state
    toast({
      title: `+${points} points!`,
      description: `You now have ${user.points + points} total points.`,
    });
  };

  return {
    isLoggedIn: true, // Always logged in for demo mode
    user,
    updatePoints
  };
};

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
