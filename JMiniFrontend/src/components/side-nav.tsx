import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home, CircleUser, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PostDrawer from "./post-drawer";
import { Loader2, MoreVertical, Eye, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SideNav({
  user_id,
  username,
  name,
  profile,
  verified,
}) {

  console.log('ujser_id', username, user_id, name, profile, verified);
  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Compass, label: "Explore", href: "/explore" },
    { icon: CircleUser, label: "Profile", href: `/profile/${username}` },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav>
      {user_id != undefined ? (
        <div className="hidden lg:flex items-center space-x-3 mb-4 px-2">
          <Avatar>
            <AvatarImage
              src={profile}
              alt="User"
              className="object-cover object-center"
            />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="">
            <div className="flex items-center">
              <p className="font-medium">{name}</p>
              {verified && (
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
            <p className="text-xs text-muted-foreground">@{username}</p>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex items-center space-x-3 mb-4 px-2">
          <Avatar>
            <AvatarImage
              src={profile}
              alt="User"
              className="object-cover object-center"
            />
            <AvatarFallback>Fr</AvatarFallback>
          </Avatar>
          <div className="">
            <div className="flex items-center">
              <p className="font-medium">Guest User</p>
            </div>
            <p className="text-xs text-muted-foreground">@guest</p>
          </div>
        </div>
      )}
      {navItems.map((item) => (
        <Link
          key={item.label}
          to={item.href}
          onClick={() => {
            if (location.pathname === item.href) {
              scrollToTop();
              window.location.reload();
            }
          }}
        >
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span className="xl:inline">{item.label}</span>
          </Button>
        </Link>
      ))}
      <PostDrawer
        user_id={user_id}
        username={username}
        name={name}
        profile={profile}
        verified={verified}
      />
    </nav>
  );
}
