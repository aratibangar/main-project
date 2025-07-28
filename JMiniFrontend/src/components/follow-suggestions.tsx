import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { transformFollowerData } from "@/lib/utils";
import { set } from "date-fns";

// TODO : Integration with API to provide suggestions
const suggestion = [
  {
    name: "MohiniPatil",
    username: "mmohini98",
    avatar: "/logo.png",
    verified: true,
  },
];

export default function FollowSuggestions({ userId = 0 }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const users = await API.get("/users");
      const following = await API.get(`/follows/following/${userId}`);
      let tranformData1 = transformFollowerData(following.data, "following");
      const userIds = tranformData1.connections.map((user) => user.userId);
      userIds.push(userId);
      const suggestions = users?.data?.content
        ?.filter((users, index) => {
          return !userIds.includes(users.userId);
        })
        .map((data) => {
          return {
            name: `${data.firstName} ${data.lastName ? data.lastName : ""}`,
            username: data.username,
            avatar: data.profile,
            verified: false,
          };
        })
        .filter((e, i) => i < 5);

      setSuggestions(suggestions);
    };
    fetchSuggestions();
  }, [userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {suggestions.length === 0 && (
            <div>There are no suggestion to display</div>
          )}
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.username}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage
                    src={suggestion.avatar}
                    alt={suggestion.name}
                    className="object-cover object-center"
                  />
                  <AvatarFallback>{suggestion.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium text-sm">{suggestion.name}</p>
                    {suggestion.verified && (
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
                  <p className="text-xs text-muted-foreground">
                    @{suggestion.username}
                  </p>
                </div>
              </div>
              <Link to={"/profile/" + suggestion.username}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
