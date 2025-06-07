import { useEffect, useState } from "react";
import Header from '../components/header';
import SideNav from '../components/side-nav';
import Trendings from '../components/trendings';
import { Skeleton } from "@/components/ui/skeleton"
import FollowSuggestions from '../components/follow-suggestions';
import BottomNav from '../components/bottom-nav';
import { Loader2, Bug, GalleryVertical, User, Eye } from 'lucide-react';
import RootLayout from "./layout";
import { onMessage } from "firebase/messaging";
import { useToast } from "@/components/ui/use-toast.js";
import Post from '../components/post'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from "@/components/ui/button.js";

export default function Search() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { query } = useParams();
  const commonWords = new Set(['a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will', 'with']);
  const searchTerms = query 
    ? query
        .split(/\s+/)
        .filter(word => !commonWords.has(word) && word.length > 0)
    : [];
  const [isLoading, setIsLoading] = useState(true);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [user_id, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");
  const [verified, setVerified] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postUserDetails, setPostUserDetails] = useState([]);
  const [lastPostId, setLastPostId] = useState(null);
  const [users, setUsers] = useState([]);
  const [isUserLoading, setIsUserLoading] = useState(true);
  
 
 
  const fetchData = async(isUpdate = false) => {
 
  }

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
        <Header activeTab="#" username={username} name={name} profile={profile} verified={verified}/>
        <div className="container mx-auto px-4 py-4 flex gap-8">
          <aside className="hidden lg:block w-1/4 sticky top-20 self-start">
            <SideNav user_id={user_id} username={username} name={name} profile={profile} verified={verified}/>
          </aside>
          <main className="w-full lg:w-1/2 pb-16 lg:pb-0">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posts" className="gap-2"><GalleryVertical className="w-4 h-4" /><span className="hidden md:block">Posts</span></TabsTrigger>
                <TabsTrigger value="accounts" className="gap-2"><User className="w-4 h-4" /><span className="hidden md:block">Accounts</span></TabsTrigger>
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
              <TabsContent value="accounts">
                { isUserLoading ? (
                    <div className="space-y-4 mb-4">
                        <div className="p-4 space-y-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                              <Skeleton className="h-12 w-12 rounded-full" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-4 w-[150px]" />
                              </div>
                          </div>
                        </div>
                    </div>
                ) : users.length === 0 ? (
                    <div className='mt-12'>
                        <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                            <Bug className="w-24 h-24"/><br />
                            <h1 className='text-4xl font-bold leading-tight'>No users found 👀</h1>
                            <p className='text-center text-muted-foreground mb-6'>
                                Try searching with different keywords
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                      {users.map((user, index) => (
                        <div key={index} 
                             className="p-4 border rounded-lg flex items-center justify-between"
                             onClick={() => navigate(`/${user.username}`)}
                             role="button"
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={user.profile} alt={user.name} className='object-cover object-center'/>
                              <AvatarFallback>Fr</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center">
                                <p className="font-medium">{user.name}</p>
                                {user.verified && 
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <BadgeCheck className="h-4 w-4 text-blue-500 ml-1" />
                                      </TooltipTrigger>
                                      <TooltipContent>Verified</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                }
                              </div>
                              <p className="text-sm text-muted-foreground">@{user.username}</p>
                            </div>
                          </div>
                            <Button 
                              className="px-4 py-1 text-sm font-medium"
                              onClick={() => { }}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                        </div>
                      ))}
                    </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
          <aside className="hidden lg:block w-1/4 sticky top-20 self-start">
            <div className="space-y-6">
              <Trendings />
              <FollowSuggestions />
              <p className='pl-4 text-sm text-muted-foreground'>2025 DreamsDoc © TeamCdac <br/><a href="https://www.cdac.com" target='_blank'>www.codejapoe.xyz</a></p>
            </div>
          </aside>
        </div>
        <BottomNav user_id={user_id} username={username} name={name} profile={profile} verified={verified}/>
      </div>
    </RootLayout>
  );
}