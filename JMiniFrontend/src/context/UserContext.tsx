// src/context/UserContext.tsx
import API from "@/lib/api";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router";

export type User = {
  userId: number;
  username: string;
  email: string;
  role: string;
  firstName: string;
  profile: string;
  isVerified: boolean;
} ;

type UserContextType = {
  user: User;
  isLoading: boolean;
  setUser: (user: User | null) => void;
};

// Create the context
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    userId: null,
    username: "",
    email: "",
    role: "",
    firstName: "",
    profile: "",
    isVerified: false,
  });
  const [isLoading, setIsLoading] = useState(true); // Add a loading state


  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await API.get("/users/me"); // Adjust the endpoint as needed       
        console.log(response.data)
        setUser(response.data);
      } catch (error) {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("isAuthenticated");
      } finally {
        setIsLoading(false)
      }
    };
    fetchLoggedInUser();
  }, []);

  const contextValue = {
    user,
    isLoading,
    setUser, // Provide a way to update the user
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");

  return context
};
