import API from "../api";

export const authApis = {
  signIn: async (user: {
    username: string;
    password: string;
  }) => {
    try {
      const { data = {} } = await API.post("/auth/login", {
        ...user
      });
      return data;
    } catch (error) {
      throw new Error("Failed to sign in: " + error.message);
    }
  },
  signUp: async (user:any) => {
    try {
      const { data = {} } = await API.post("/auth/register", {
        ...user,
      });
      return data;
    } catch (error) {
      throw new Error("Failed to sign up: " + error?.response?.data ? error?.response?.data : error);
    }
  },
  getCurrentUser: async () => {
    try {
      const { data = {} } = await API.get("/auth/me");
      return data;
    } catch (error) {
      throw new Error("Failed to get current user: " + error.message);
    }
  },
};
