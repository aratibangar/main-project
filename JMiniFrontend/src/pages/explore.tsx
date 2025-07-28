import { useEffect, useState } from "react";
import Header from '../components/header';
import SideNav from '../components/side-nav';
import Trendings from '../components/trendings';
import { Skeleton } from "@/components/ui/skeleton"
import FollowSuggestions from '../components/follow-suggestions';
import BottomNav from '../components/bottom-nav';
import { Loader2, Bug, Clapperboard, Image, GalleryVertical, RotateCw } from 'lucide-react';
import RootLayout from "./layout";
import { useToast } from "@/components/ui/use-toast.js";
import Post from '../components/post'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button";
import API from "@/lib/api";
import { useCurrentLoggedInUser } from "@/hooks/useCurrentLoggedInUser";

export default function Explore() {
  const { toast } = useToast();
  const { user, isLoading: isLoadingUser} = useCurrentLoggedInUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [user_id, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");
  const [verified, setVerified] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postUserDetails, setPostUserDetails] = useState([]);
  const [lastPostId, setLastPostId] = useState(null);
  //const [showTabs, setShowTabs] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsPostLoading(true);
      await fetchData();
      setIsPostLoading(false);
    }
    loadData();

    const intervalId = setInterval(() => {
      fetchData(true);
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async(isUpdate = false) => {
      let sortBy = 'dreamId'; 
      let sortOrder = 'asc';
     const params = {
        page: 1,
        size: 20,
        sort: `${sortBy},${sortOrder}`,
      };
       const response  = await API.get('/dreams', {
        params
       });
       setPosts(response.data || []);
  }

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex flex-col space-y-4 items-center justify-center">
        <Loader2 className="animate-spin" />
        Loading...
      </div>
    );
  }

  console.log('Explore Page', user, user_id, username, name, profile, verified);
  

  return (
    <RootLayout>
      <div className="min-h-screen bg-background text-foreground">
        <Header activeTab="#" username={username} name={name} profile={profile} verified={verified}/>
        <div className="container mx-auto px-4 py-4 flex gap-8">
          <aside className="hidden lg:block w-1/4 sticky top-20 self-start">
            <SideNav user_id={user?.userId} username={user?.username} name={user?.firstName} profile={user?.profile} verified={user?.isVerified}/>
          </aside>
          <main className="w-full lg:w-1/2 pb-16 lg:pb-0">
            <div className="flex justify-between items-center pb-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage></BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
                <Button size="icon" variant="outline" onClick={() => fetchData()}>
                  <RotateCw className="w-4 h-4" />
                </Button>
            </div>
            {/*{ !showTabs ? (*/}
              { isPostLoading ? (
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
                    <div className='mt-12'>
                        <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                            <Bug className="w-24 h-24"/><br />
                            <h1 className='text-4xl font-bold leading-tight'>Nothing to see 👀</h1>
                            <p className='text-center text-muted-foreground mb-6'>
                                Posts will appear here <br/> when someone posts.
                            </p>
                        </div>
                    </div>
                ) : (
                    posts.map((post, index) => (
                      <Post 
                      key={index} 
                      currentUserID={user.userId}
                      currentUsername={username}
                      id={post.dreamId} 
                      user_id={post.user.userId} 
                      name={post.user.name} 
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
                      likes={post.likeCount} 
                      comments={post.comment} 
                      reposts={post.reposts} 
                      {...post} 
                      />
                    ))
                )}
            {/*
            ) : (
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts" className="gap-2"><GalleryVertical className="w-4 h-4" /><span className="hidden md:block">Posts</span></TabsTrigger>
                <TabsTrigger value="carousels" className="gap-2"><Image className="w-4 h-4" /><span className="hidden md:block">Carousels</span></TabsTrigger>
                <TabsTrigger value="reels" className="gap-2"><Clapperboard className="w-4 h-4" /><span className="hidden md:block">Reels</span></TabsTrigger>
              </TabsList>
              <TabsContent value="posts">
                { isPostLoading ? (
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
                    <div className='mt-12'>
                        <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                            <Bug className="w-24 h-24"/><br />
                            <h1 className='text-4xl font-bold leading-tight'>Nothing to see 👀</h1>
                            <p className='text-center text-muted-foreground mb-6'>
                                Posts will appear here <br/> when someone posts.
                            </p>
                        </div>
                    </div>
                ) : (
                    posts.map((post, index) => (
                      post.type === "post" &&
                      <Post 
                      key={index} 
                      currentUserID={user_id}
                      currentUsername={username}
                      id={post.$id} 
                      user_id={post.user_id} 
                      name={postUserDetails[post.$id]?.name} 
                      username={postUserDetails[post.$id]?.username} 
                      profile={postUserDetails[post.$id]?.profile} 
                      isVerified={postUserDetails[post.$id]?.verified} 
                      timestamp={post.$createdAt} 
                      caption={post.caption} 
                      type={post.type} 
                      files={post.files} 
                      location={post.location} 
                      hashtags={post.hashtags} 
                      tagged_people={post.tagged_people} 
                      likes={post.likes} 
                      comments={post.comment} 
                      reposts={post.reposts} 
                      {...post} 
                      />
                    ))
                )}
              </TabsContent>
              <TabsContent value="carousels">
                { isPostLoading ? (
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
                    <div className='mt-12'>
                        <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                            <Bug className="w-24 h-24"/><br />
                            <h1 className='text-4xl font-bold leading-tight'>Nothing to see 👀</h1>
                            <p className='text-center text-muted-foreground mb-6'>
                                Posts will appear here <br/> when someone posts.
                            </p>
                        </div>
                    </div>
                ) : (
                    posts.map((post, index) => (
                      post.type === "carousel" &&
                      <Post 
                      key={index} 
                      currentUserID={user_id}
                      currentUsername={username}
                      id={post.$id} 
                      user_id={post.user_id} 
                      name={postUserDetails[post.$id]?.name} 
                      username={postUserDetails[post.$id]?.username} 
                      profile={postUserDetails[post.$id]?.profile} 
                      isVerified={postUserDetails[post.$id]?.verified} 
                      timestamp={post.$createdAt} 
                      caption={post.caption} 
                      type={post.type} 
                      files={post.files} 
                      location={post.location} 
                      hashtags={post.hashtags} 
                      tagged_people={post.tagged_people} 
                      likes={post.likes} 
                      comments={post.comment} 
                      reposts={post.reposts} 
                      {...post} 
                      />
                    ))
                )}
              </TabsContent>
              <TabsContent value="reels">
                { isPostLoading ? (
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
                    <div className='mt-12'>
                        <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                            <Bug className="w-24 h-24"/><br />
                            <h1 className='text-4xl font-bold leading-tight'>Nothing to see 👀</h1>
                            <p className='text-center text-muted-foreground mb-6'>
                                Posts will appear here <br/> when someone posts.
                            </p>
                        </div>
                    </div>
                ) : (
                    posts.map((post, index) => (
                      post.type === "reel" &&
                      <Post 
                      key={index} 
                      currentUserID={user_id}
                      currentUsername={username}
                      id={post.$id} 
                      user_id={post.user_id} 
                      name={postUserDetails[post.$id]?.name} 
                      username={postUserDetails[post.$id]?.username} 
                      profile={postUserDetails[post.$id]?.profile} 
                      isVerified={postUserDetails[post.$id]?.verified} 
                      timestamp={post.$createdAt} 
                      caption={post.caption} 
                      type={post.type} 
                      files={post.files} 
                      location={post.location} 
                      hashtags={post.hashtags} 
                      tagged_people={post.tagged_people} 
                      likes={post.likes} 
                      comments={post.comment} 
                      reposts={post.reposts} 
                      {...post} 
                      />
                    ))
                )}
              </TabsContent>
            </Tabs>
            )}*/}
          </main>
          <aside className="hidden lg:block w-1/4 sticky top-20 self-start">
            <div className="space-y-6">
              <FollowSuggestions userId={user?.userId}/>
              <p className='pl-4 text-sm text-muted-foreground'>2025 DreamsDoc © TeamCdac <br/><a href="https://www.cdac.com" target='_blank'>www.cdac.com</a></p>
            </div>
          </aside>
        </div>
        <BottomNav user_id={user_id} username={username} name={name} profile={profile} verified={verified}/>
      </div>
    </RootLayout>
  );
}