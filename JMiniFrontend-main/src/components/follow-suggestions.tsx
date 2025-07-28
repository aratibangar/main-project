import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { BadgeCheck } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const suggestions = [
  { name: 'MohiniPatil', username: 'mmohini98', avatar: '/logo.png', verified: true },
]

export default function FollowSuggestions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {suggestions.map((suggestion) => (
            <li key={suggestion.username} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={suggestion.avatar} alt={suggestion.name} className='object-cover object-center' />
                  <AvatarFallback>{suggestion.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className='flex items-center'>
                  <p className="font-medium text-sm">{suggestion.name}</p>
                  {suggestion.verified && <TooltipProvider><Tooltip><TooltipTrigger><BadgeCheck className="h-4 w-4 text-blue-500 ml-1" /></TooltipTrigger><TooltipContent>Verified</TooltipContent></Tooltip></TooltipProvider>}
                  </div>
                  <p className="text-xs text-muted-foreground">@{suggestion.username}</p>
                </div>
              </div>
              <Link to={"/"+suggestion.username}>
                <Button variant="outline" size="sm">View</Button>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}