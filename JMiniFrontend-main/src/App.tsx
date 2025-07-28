import { Suspense, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Home from "./pages/home";
import Explore from "./pages/explore";
import PostViewer from "./pages/post-viewer";
import Profile from "./pages/profile";
import Settings from "./components/settings";
import ProtectedRoute from "./layout/ProtectedRoute";
import { useUser } from "./context/UserContext";
import AdminPanel from "./pages/admin-panel";

function App() {
  const user = useUser(); 
  console.log("App component rendered", user);
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        {/* public routes */}
        <Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
      
      {/* Private only for admin role */}
      <Route>
         <Route path="/admin" element={<AdminPanel/>}/>
      </Route>


        {/* private routes */}
        <Route>
          <Route
            index
            path="/"
            element={
              <ProtectedRoute>
                <Home />
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
            path="/post/:id"
            element={
              <ProtectedRoute>
                <PostViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:id"
            element={
              <ProtectedRoute>
                <Profile />
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
