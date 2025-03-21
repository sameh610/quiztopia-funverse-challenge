
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './use-toast';

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar?: string;
  points: number;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
  updatePoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample user data - in a real app, this would come from a backend
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    initials: 'JD',
    points: 12345
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    initials: 'JS',
    points: 9876
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('quiztopia_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = () => {
    // In a real app, this would be an authentication API call
    // For now, we'll just pick a random mock user
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    setUser(randomUser);
    setIsLoggedIn(true);
    localStorage.setItem('quiztopia_user', JSON.stringify(randomUser));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('quiztopia_user');
  };

  const updatePoints = (points: number) => {
    if (user) {
      const updatedUser = { ...user, points: user.points + points };
      setUser(updatedUser);
      localStorage.setItem('quiztopia_user', JSON.stringify(updatedUser));
      
      toast({
        title: `+${points} points!`,
        description: `You now have ${updatedUser.points} total points.`,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updatePoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
