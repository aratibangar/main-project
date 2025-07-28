import API from "@/lib/api";
import { useEffect, useState } from "react";
type User = {
  userId: number;
  username: string;
  email: string;
  role: string;
  firstName: string;
  profile: string;
  isVerified: boolean;
};
export const useCurrentLoggedInUser = () => {
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
        if(!!response?.data){
            console.log(response?.data);
           setUser(response.data);
        }
      } catch (error) {
        console.error(error);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("isAuthenticated");
      } finally {
        setIsLoading(false);
      }
    };
    if(!user.userId){
        fetchLoggedInUser();
    }
  }, []);

  return {
    user: user,
    isLoading,
  };
};
