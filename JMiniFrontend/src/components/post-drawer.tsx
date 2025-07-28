import { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import Cookies from "js-cookie";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { FaGoogleDrive } from "react-icons/fa";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { MapPin, Hash, Users, SquarePen, Image, BadgeCheck, Clapperboard, GalleryVertical, Info } from 'lucide-react';
import API from '@/lib/api';
import { useGoogleDriveAPI } from '@/hooks/useGoogleDriveAPI';
import { useCurrentLoggedInUser } from '@/hooks/useCurrentLoggedInUser';

interface PostDialogueProps {
  user_id: string,
  username: string,
  name: string,
  profile: string,
  verified: boolean
}

export default function PostDrawer({ user_id, username, name, profile, verified}: PostDialogueProps ) {
  const { toast } = useToast()
  const [isPostDrawerOpen, setPostDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("post");
  const [files, setFiles] = useState<File[]>([]);
  let fileLinks = [];
  const [title, setTitle] = useState("");

  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [tag, setTag] = useState("");
  const [people, setPeople] = useState("");
  const [captionError, setCaptionError] = useState("")
  
  const {
    user,
    isLoading
  } = useCurrentLoggedInUser(); 

  
  const {
    GoogleDriveAuth,
    GoogleDriveLogin,
    searchFolder,
    createFolder,
    uploadFile,
    resetToken,
    accessToken,
  } = useGoogleDriveAPI();

  const handleFileUpload = async (files: File[]): Promise<string[]> => {
    try {
      let folderId = await searchFolder('DreamsDoc');
  
      if (!folderId) {
        folderId = await createFolder('DreamsDoc');
      }
  
      const uploadPromises = files.map((file) => uploadFile(file, folderId,file.type));
      await Promise.all(uploadPromises);
      return ;
    } catch (error) {
      resetToken();
      toast({
        variant: "destructive",
        title: "Unable to upload media",
        description: "Please sign into Google Drive again.",
        duration: 3000
      })
      throw error;
    }
  };

  const handlePost = async () => {    
   
    if (files.length > 0) {
      try {
        fileLinks = await handleFileUpload(files);
      } catch (error) {
        console.error("Error uploading files:", error);
        toast({
          variant: "destructive",
          title: "Failed to upload files",
          description: "Please try again later.",
          duration: 3000
        });
        return;
      }
    }

    if(caption === ""){
      setCaptionError('Caption Should not be Empty');
      return ;
    }
     
    const response = await API.post('/dreams', {
       userId: user?.userId,
       content: caption,
       tags: tag,
       title: title,
       visibility: 'public',
    });

    if (response.status === 200) {
      toast({
        title: "Post created successfully",
        description: "Your post has been created.",
        duration: 3000
      });
      setPostDrawerOpen(false);
      setCaption("");
      setLocation("");
      setTag("");
      setPeople("");
      setFiles([]);
    } else {
      toast({
        variant: "destructive",
        title: "Failed to create post",
        description: response.data.message || "An error occurred while creating the post.",
        duration: 3000
      });
    }
  }
    
  const handleCaption = (e) => {
    console.log(
      e.target.value, "ss"
    );
    
    if(e.target.value === ""){
      setCaptionError("Caption should not be empty")
    }else{
      setCaption(e.target.value);
    }
  }

  const handleLocation = (e) => {
    setLocation(e.target.value);
  }

  const handleTag = (e) => {
    setTag(e.target.value);
  }

  const handlePeople = (e) => {
    setPeople(e.target.value);
  }

  return (
    <div>
    <Drawer open={isPostDrawerOpen} onOpenChange={setPostDrawerOpen}>
      <DrawerTrigger asChild>
      <div>
        {/* First Button: Visible on large (`lg`) and extra-large (`xl`) screens */}
        <Button className="mt-4 w-full hidden lg:flex xl:flex items-center justify-center" disabled={!user_id}>
          <SquarePen className="mr-2 h-4 w-4" />
          <span className="inline">Post</span>
        </Button>

        {/* Second Button: Visible on medium (`md`) screens but hidden on large (`lg`) and extra-large (`xl`) screens */}
        <Button className="flex md:flex lg:hidden xl:hidden items-center justify-center" size="icon" disabled={!user_id}>
          <SquarePen className="h-4 w-4" />
        </Button>
      </div>
      </DrawerTrigger>
      <DrawerContent className='bg-background'>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className='flex justify-between items-center'>
            <div className='text-left w-full md:w-auto'>
              <DrawerTitle>Create New</DrawerTitle>
              <DrawerDescription>Share your thoughts.</DrawerDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Post Guidelines</DialogTitle>
                  <DialogDescription className="whitespace-pre-line">
                  {'\n'}Post: Best for content writing and general purpose.{'\n'}
                    Carousel: Best for your favorite photos.{'\n'}
                    Reel: Best for videos.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Tabs defaultValue="post" className="w-full" onValueChange={(value) => setActiveTab(value)}>
                <TabsList className="grid w-full grid-cols-6 flex justify-center">
                  <TabsTrigger value="post" className='gap-2'>
                    <GalleryVertical className='h-4 w-[2rem]'></GalleryVertical>
                    <span className='hidden md:block'>Post</span>
                  </TabsTrigger>
                  {/* <TabsTrigger value="carousel" className='gap-2'>
                    <Image className='h-4 w-4'></Image>
                    <span className='hidden md:block'>Carousel</span>
                  </TabsTrigger>
                  <TabsTrigger value="reel" className='gap-2'>
                    <Clapperboard className='h-4 w-4'></Clapperboard>
                    <span className='hidden md:block'>Reel</span>
                  </TabsTrigger> */}
                </TabsList>
                <TabsContent value="post">
                  <div className="flex items-start justify-between mt-4 mb-2">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={profile} alt="MM" className='object-cover object-center'/>
                        <AvatarFallback>MM</AvatarFallback>
                      </Avatar> 
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">{user_id ? name : "Guest User"}</p>
                          {user_id && verified && <TooltipProvider><Tooltip><TooltipTrigger><BadgeCheck className="h-4 w-4 text-blue-500 ml-1" /></TooltipTrigger><TooltipContent>Verified</TooltipContent></Tooltip></TooltipProvider>}
                        </div>
                        <p className="text-sm text-muted-foreground">@{user_id ? username : "guest"}</p>
                      </div>
                    </div>
                  </div>
                  <Label htmlFor="title" className="text-sm font-medium mb-2">
                    Title
                  </Label>
                  <Input name="title" value={title} onChange={(e)=> setTitle(e.target.value)}/>
                  <Label htmlFor="caption" className="text-sm font-medium">
                    Caption
                  </Label>
                  <Textarea rows={8} placeholder="What's new?" className='mt-2 mb-2 text-md' onChange={handleCaption}/>
                  <div className='text-[red]'>{captionError}</div>
                  <div className='space-y-2'>
                    <Label htmlFor="photo" className="text-sm font-medium">
                      File
                    </Label>
                    { accessToken == undefined ? (
                      <Button
                        variant="outline"
                        onClick={() => GoogleDriveAuth()}
                        className="w-full"
                      >
                        <FaGoogleDrive className="h-4 w-4 mr-2" />
                        <span>Sign in with Google Drive</span>
                      </Button>
                    ) : (
                      <Input id="photo" type="file" multiple accept="image/*, video/*" onChange={(e) => setFiles(Array.from(e.target.files))}/>
                    )}
                    <ToggleGroup className='mt-2' type="single">
                      <ToggleGroupItem value="location">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Location</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Location</DialogTitle>
                              <DialogDescription>
                                Enter location you took the photos. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Add location" className="text-md" onChange={handleLocation} />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button">
                                  Save
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="tag">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Hashtag</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Hashtag</DialogTitle>
                              <DialogDescription>
                                Enter hashtags here. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 mt-1">
                              <Hash className="h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Add tags" className="text-md" onChange={handleTag} />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button">
                                  Save
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="people">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Tag People</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Tag people</DialogTitle>
                              <DialogDescription>
                                Tag people in your content. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 mt-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Add tagged people" className="text-md" onChange={handlePeople} />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button">
                                  Save
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </TabsContent>
                <TabsContent value="carousel">
                  <div className="flex items-start justify-between mt-4 mb-2">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={profile} alt="Fr" className='object-cover object-center' />
                        <AvatarFallback>Fr</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">{user_id ? name : "Guest User"}</p>
                          {user_id && verified && <TooltipProvider><Tooltip><TooltipTrigger><BadgeCheck className="h-4 w-4 text-blue-500 ml-1" /></TooltipTrigger><TooltipContent>Verified</TooltipContent></Tooltip></TooltipProvider>}
                        </div>
                        <p className="text-sm text-muted-foreground">@{user_id ? username : "guest"}</p>
                      </div>
                    </div>
                  </div>
                  <Label htmlFor="caption" className="text-sm font-medium">
                    Caption
                  </Label>
                  <Textarea rows={4} placeholder="What's new?" className='mt-2 mb-2 text-md' onChange={handleCaption}/>
                  <div className='space-y-2'>
                    <Label htmlFor="photo" className="text-sm font-medium">
                      Photos (or) Videos
                    </Label>
                    { accessToken == undefined ? (
                      <Button
                        variant="outline"
                        onClick={() => GoogleDriveAuth()}
                        className="w-full"
                      >
                        <FaGoogleDrive className="h-4 w-4 mr-2" />
                        <span>Sign in with Google Drive</span>
                      </Button>
                    ) : (
                      <Input id="photo" type="file" multiple accept="image/*, video/*" onChange={(e) => setFiles(Array.from(e.target.files))}/>
                    )}
                    <ToggleGroup type="single">
                      <ToggleGroupItem value="location">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Location</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Location</DialogTitle>
                              <DialogDescription>
                                Enter location you took the photos. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <Input id="location" placeholder="Add location" className="text-md" onChange={handleLocation} />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button">
                                  Save
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="tag">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Hashtag</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Hashtag</DialogTitle>
                              <DialogDescription>
                                Enter hashtags here. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 mt-1">
                              <Hash className="h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Add tags" className="text-md" onChange={handleTag} />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button">
                                  Save
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="people">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Tag People</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Tag people</DialogTitle>
                              <DialogDescription>
                                Tag people in your photos and videos. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 mt-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Add tagged people" className="text-md" onChange={handlePeople} />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button">
                                  Save
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </TabsContent>
                <TabsContent value="reel">
                  <div className="flex items-start justify-between mt-4 mb-2">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={profile} alt="Fr" className='object-cover object-center' />
                        <AvatarFallback>Fr</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">{user_id ? name : "Guest User"}</p>
                          {user_id && verified && <TooltipProvider><Tooltip><TooltipTrigger><BadgeCheck className="h-4 w-4 text-blue-500 ml-1" /></TooltipTrigger><TooltipContent>Verified</TooltipContent></Tooltip></TooltipProvider>}
                        </div>
                        <p className="text-sm text-muted-foreground">@{user_id ? username : "guest"}</p>
                      </div>
                    </div>
                  </div>
                  <Label htmlFor="caption" className="text-sm font-medium">
                    Caption
                  </Label>
                  <Textarea rows={4} placeholder="What's new?" className='mt-2 mb-2 text-md' onChange={handleCaption} />
                  <div className='space-y-2'>
                    <Label htmlFor="photo" className="text-sm font-medium">
                      Video
                    </Label>
                    { accessToken == undefined ? (
                      <Button
                        variant="outline"
                        onClick={() => GoogleDriveAuth()}
                        className="w-full"
                      >
                        <FaGoogleDrive className="h-4 w-4 mr-2" />
                        <span>Sign in with Google Drive</span>
                      </Button>
                    ) : (
                      <Input id="photo" type="file" accept="video/*" onChange={(e) => setFiles(Array.from(e.target.files))}/>
                    )}
                    <ToggleGroup type="single">
                      <ToggleGroupItem value="location">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Location</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Location</DialogTitle>
                              <DialogDescription>
                                Enter location you took the photos. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <Input id="location" placeholder="Add location" className="text-md" onChange={handleLocation} />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button">
                                  Save
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="tag">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Hashtag</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Hashtag</DialogTitle>
                              <DialogDescription>
                                Enter hashtags here. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 mt-1">
                              <Hash className="h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Add tags" className="text-md" onChange={handleTag} />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button">
                                  Save
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="people">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Tag People</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Tag people</DialogTitle>
                              <DialogDescription>
                                Tag people in your reel. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 mt-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Add tagged people" className='text-md' onChange={handlePeople} />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button">
                                  Save
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handlePost}>Post</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
    </div>
    
  )
}