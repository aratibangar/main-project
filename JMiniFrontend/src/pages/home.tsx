import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import SideNav from "../components/side-nav";
import Trendings from "../components/trendings";
import Post from "../components/post";
import FollowSuggestions from "../components/follow-suggestions";
// import BottomNav from '../components/bottom-nav';
import { Loader2 } from "lucide-react";
import RootLayout from "./layout";
import { useToast } from "@/components/ui/use-toast.js";
import { Skeleton } from "@/components/ui/skeleton";
import { Bug } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import API from "@/lib/api";

export default function Home({
      user: { userId, username, firstName, profile, isVerified = false },
  } ) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [followings, setFollowings] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  useEffect(() => {
    verifyUser();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      console.log('loading post')
      try {
        setIsPostsLoading(true);
        await fetchPosts();
      } catch (error) {
      } finally {
        setIsPostsLoading(false);
      }
    };

    if(userId !== null){
      loadPosts();
    }
    const intervalId = setInterval(async () => {
      if(userId !== null){
        await fetchPosts();
      }
    }, 30000);
  
    return () => clearInterval(intervalId);
  
  }, [userId]);

  const verifyUser = async () => {};

  const fetchPosts = async () => {
    try {
      const response = await API.get(`/dreams/user/${userId}`);
      setPosts(response.data);
    } catch (error) {}
  };

  const deletePost = async (id) => {
     const response  = await API.delete(`/dreams/${id}`);
     if(response.status == 200){
       fetchPosts();
     }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col space-y-4 items-center justify-center">
        <Loader2 className="animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <RootLayout>
      <div className="min-h-screen bg-background text-foreground">
        <Header
          activeTab="followings"
          username={username}
          name={name}
          profile={profile}
          verified={isVerified}
        />
        <div className="container mx-auto px-4 py-8 flex gap-8">
          <aside className="hidden lg:block w-1/4 sticky top-20 self-start">
            <SideNav
              user_id={userId}
              username={username}
              name={firstName}
              profile={profile}
              verified={isVerified}
            />
          </aside>
          <main className="w-full lg:w-1/2 pb-16 lg:pb-0">
            {isPostsLoading ? (
              <div className="space-y-4 mb-4">
                <div className="p-4 space-y-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-[300px]" />
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="mt-12">
                <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
                  <Bug className="w-24 h-24" />
                  <br />
                  <h1 className="text-4xl font-bold leading-tight">
                    Nothing to see 👀
                  </h1>
                  <p className="text-center text-muted-foreground mb-6">
                    Posts will appear here <br /> when you follow an active user
                    or someone posts.
                  </p>
                </div>
              </div>
            ) : (
              posts.map((post, index) => { 
                console.log('post============',post)
                return (
                <Post
                  key={index}
                  title={post.title}
                  currentUserID={userId}
                  currentUsername={username}
                  id={post.dreamId}
                  user_id={post.user.userId}
                  name={post.user.firstName}
                  username={post.user.username}
                  profile={post.user.profile}
                  isVerified={post.user.verified}
                  timestamp={post.createdAt}
                  caption={post.content}
                  type={post.type}
                  files={post.files}
                  location={post.location}
                  hashtags={post.hashtags}
                  tagged_people={post.tagged_people}
                  likes={post.likes}
                  comments={post.comment}
                  reposts={post.reposts}
                  deletePost={deletePost}
                  reactions={post.reactions}
                  {...post}
                />
              )})
            )}
          </main>
          <aside className="hidden lg:block w-1/4 sticky top-20 self-start">
            <div className="space-y-6">
              <FollowSuggestions userId={userId}/>
              <p className="pl-4 text-sm text-muted-foreground">
                2025 DreamsDoc © TeamCdac <br />
                <a href="https://www.cdac.com" target="_blank">
                  www.cdac.com
                </a>
              </p>
            </div>
          </aside>
        </div>
        <BottomNav
          user_id={userId}
          username={username}
          name={name}
          profile={profile}
          verified={isVerified}
        />
      </div>
    </RootLayout>
  );
}
