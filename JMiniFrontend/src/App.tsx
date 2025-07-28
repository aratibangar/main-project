import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Home from "./pages/home";
import Explore from "./pages/explore";
import Profile from "./pages/profile";
import Settings from "./components/settings";
import ProtectedRoute from "./layout/ProtectedRoute";
import AdminPanel from "./pages/admin-panel";
import NotFoundError from "./pages/404";
import { Loader, Loader2 } from "lucide-react";
import { useCurrentLoggedInUser } from "./hooks/useCurrentLoggedInUser";
import { User } from "./context/UserContext";

function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    userId: 0,
    role: "ROLE_USER",
    firstName: "",
    isVerified: false,
    username: "",
    profile:"",
    email: "",
  });
  const {
    user = {
      userId: 0,
      role: "ROLE_USER",
      firstName: "",
      isVerified: false,
      username: "",
      profile:"",
      email: "",
    },
    isLoading,
  } = useCurrentLoggedInUser();
  const renderCount = useRef(0);

  useEffect(() => {
      setCurrentUser(user);
  },[isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4 h-[80vh]">
        <Loader className="animate-spin w-40 h-40" />
      </div>
    );
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        {/* public routes */}
        <Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>

        {/* Private only for admin role */}
        {currentUser?.role === "ROLE_ADMIN" && (
          <Route>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        )}

        {/* private routes */}
        <Route>
          <Route
            index
            path="/"
            element={
              <ProtectedRoute>
                <Home user={currentUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Profile user={currentUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/:page"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundError />} />
          {/* <Route path='/search/:query' element={<Search/>}/> */}
          {/* <Route path='/favorites' element={<Favorite/>}/> */}
          {/* <Route path='/hashtag/:tag' element={<HashTag/>}/> */}
          {/* <Route path='/bookmarks' element={<Bookmarks/>}/> */}
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
