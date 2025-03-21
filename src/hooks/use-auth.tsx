
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
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

export const useAuth = (): AuthContextType => {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const { toast } = useToast();
  
  // Convert clerk user to our app's user format
  const user: User | null = isLoaded && isSignedIn && clerkUser
    ? {
        id: clerkUser.id,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim() || clerkUser.username || 'User',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        initials: getInitials(`${clerkUser.firstName} ${clerkUser.lastName}`.trim() || clerkUser.username || 'User'),
        avatar: clerkUser.imageUrl,
        points: parseInt(clerkUser.publicMetadata.points as string || '0')
      }
    : null;

  const updatePoints = (points: number) => {
    if (!user) return;
    
    // In a real implementation, this would update Clerk user metadata
    // For this demo, we'll just show the toast
    toast({
      title: `+${points} points!`,
      description: `You now have ${user.points + points} total points.`,
    });
  };

  return {
    isLoggedIn: isLoaded && isSignedIn,
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
