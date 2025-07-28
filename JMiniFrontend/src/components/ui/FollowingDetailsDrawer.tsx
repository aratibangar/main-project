import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";

const FollowingDetailsDrawer = ({
  open,
  setOpen,
  title,
  description,
  triggerCount,
  triggerLabel,
  users,
  onUserClick,
}) => {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="cursor-pointer hover:opacity-80 ml-2">
          <span className="font-bold">{triggerCount}</span>{" "}
          <span className="text-muted-foreground">{triggerLabel}</span>
        </div>
      </DrawerTrigger>
      <DrawerContent className="bg-background max-h-[100%]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>

          <ScrollArea className="overflow-y-auto">
            <div className="p-4 space-y-4" key={users[0]?.user_id}>
              {users.length === 0 ? (
                <p className="text-center text-muted-foreground">No data available</p>
              ) : (
                users.map((user) => (
                  <div key={user.$id} className="flex items-center gap-4">
                    <Link to={`/${user.username}`} onClick={onUserClick}>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.profile} />
                        <AvatarFallback>Fr</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Link
                          to={`/${user.username}`}
                          className="font-semibold"
                          onClick={onUserClick}
                        >
                          {user.name}
                        </Link>
                        {user.verified && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeCheck className="h-4 w-4 text-blue-500 ml-1" />
                              </TooltipTrigger>
                              <TooltipContent>Verified</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <Link to={`/profile/${user.username}`} onClick={onUserClick}>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FollowingDetailsDrawer;
