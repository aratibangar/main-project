// src/context/UserContext.tsx
import API from '@/lib/api';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
        try {
            const response = await API.get('/users/me'); // Adjust the endpoint as needed
            if (response.status === 200) {
                setUser(response.data);
            } else {
                console.error('Failed to fetch user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
    fetchLoggedInUser();
  },[]);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
