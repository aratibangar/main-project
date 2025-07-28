"use client"

import * as React from "react"
import { Heart, ThumbsDown, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  avatar?: string
}

interface ReactionData {
  id: string
  emoji: string
  label: string
  icon: React.ReactNode
  color: string
  hoverColor: string
  users: User[]
}

interface EmojiReactionButtonProps {
  reactions?: ReactionData[]
  currentUserId?: string
  onReactionChange?: (reactionId: string | null) => void
}

const reactionTypes = [
  {
    id: "like",
    emoji: "❤️",
    label: "Like",
    icon: <Heart className="h-4 w-4" />,
    color: "text-red-500",
    hoverColor: "hover:text-red-600",
  },
  {
    id: "dislike",
    emoji: "👎",
    label: "Dislike",
    icon: <ThumbsDown className="h-4 w-4" />,
    color: "text-blue-500",
    hoverColor: "hover:text-blue-600",
  },
  {
    id: "cry",
    emoji: "😢",
    label: "Sad",
    icon: <span className="text-sm">😢</span>,
    color: "text-blue-400",
    hoverColor: "hover:text-blue-500",
  },
  {
    id: "best",
    emoji: "🔥",
    label: "Fire",
    icon: <Flame className="h-4 w-4" />,
    color: "text-orange-500",
    hoverColor: "hover:text-orange-600",
  },
]

export function EmojiReactionButton({
  reactions = [],
  currentUserId = "current-user",
  onReactionChange,
}: EmojiReactionButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [showReactionDetails, setShowReactionDetails] = React.useState(false)
  const [longPressTimer, setLongPressTimer] = React.useState(null)
  const [isLongPress, setIsLongPress] = React.useState(false)

  // Get current user's reaction
  const currentUserReaction = reactions.find((r) => r.users.some((user) => user.id === currentUserId))

  // Get total reaction count
  const totalReactions = reactions.reduce((sum, reaction) => sum + reaction.users.length, 0)

  // Get reactions with counts > 0
  const activeReactions = reactions.filter((r) => r.users.length > 0)
  console.log('activeReactions', activeReactions);
  

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const handleMouseDown = () => {
    setIsLongPress(false)
    const timer = setTimeout(() => {
      setIsLongPress(true)
      setIsOpen(true)
    }, 500)
    setLongPressTimer(timer)
  }

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    if (!isLongPress) {
      const currentReactionId = currentUserReaction?.id || null
      handleReactionSelect(currentReactionId === "like" ? null : "like")
    }
    setIsLongPress(false)
  }

  const handleMouseLeave = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
    setIsLongPress(false)
  }

  const handleTouchStart = () => {
    setIsLongPress(false)
    const timer = setTimeout(() => {
      setIsLongPress(true)
      setIsOpen(true)
    }, 500)
    setLongPressTimer(timer)
  }

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    if (!isLongPress) {
      const currentReactionId = currentUserReaction?.id || null
      handleReactionSelect(currentReactionId === "like" ? null : "like")
    }
    setIsLongPress(false)
  }

  const handleReactionSelect = (reactionId: string | null) => {
    onReactionChange?.(reactionId)
    setIsOpen(false)
  }

  const getButtonStyles = () => {
    if (!currentUserReaction) return ""
    const reactionType = reactionTypes.find((r) => r.id === currentUserReaction.id)
    return reactionType ? `${reactionType.color} ${reactionType.hoverColor}` : ""
  }

  const getTooltipText = () => {
    if (currentUserReaction) {
      const reactionType = reactionTypes.find((r) => r.id === currentUserReaction.id)
      return `Remove ${reactionType?.label || "reaction"}`
    }
    return "Like"
  }

  const getMainReactionIcon = () => {
    if (currentUserReaction) {
      const reactionType = reactionTypes.find((r) => r.id === currentUserReaction.id)
      if (reactionType) {
        if (reactionType.id === "like") {
          return <Heart className="h-4 w-4 mr-1 fill-current" />
        } else if (reactionType.id === "dislike") {
          return <ThumbsDown className="h-4 w-4 mr-1" />
        } else if (reactionType.id === "best") {
          return <Flame className="h-4 w-4 mr-1" />
        } else {
          return <span className="mr-1">{reactionType.emoji}</span>
        }
      }
    }
    return <Heart className="h-4 w-4 mr-1" />
  }

  return (
    <div className="space-y-2">
      <TooltipProvider>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-2 select-none ${getButtonStyles()}`}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {getMainReactionIcon()}
                  {totalReactions > 0 ? formatCount(totalReactions) : "0"}
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getTooltipText()}</p>
            </TooltipContent>
          </Tooltip>

          <PopoverContent className="w-auto p-2" align="center" side="top" sideOffset={8}>
            <div className="flex gap-1">
              {reactionTypes.map((reactionType) => {
                const isSelected = currentUserReaction?.id === reactionType.id
                return (
                  <Button
                    key={reactionType.id}
                    variant="ghost"
                    size="sm"
                    className={`h-10 w-10 p-0 hover:scale-110 transition-transform ${
                      isSelected ? `${reactionType.color} bg-secondary` : "hover:bg-secondary"
                    }`}
                    onClick={() => handleReactionSelect(isSelected ? null : reactionType.id)}
                    title={reactionType.label}
                  >
                    {reactionType.id === "like" ? (
                      <Heart className={`h-5 w-5 ${isSelected ? "fill-current" : ""}`} />
                    ) : reactionType.id === "dislike" ? (
                      <ThumbsDown className="h-5 w-5" />
                    ) : reactionType.id === "best" ? (
                      <Flame className="h-5 w-5" />
                    ) : (
                      <span className="text-lg">{reactionType.emoji}</span>
                    )}
                  </Button>
                )
              })}
            </div>
          </PopoverContent>
        </Popover>
      </TooltipProvider>

      {/* Reaction Summary */}
      {activeReactions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Popover open={showReactionDetails} onOpenChange={setShowReactionDetails}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-auto p-1 hover:bg-secondary/50">
                <div className="flex items-center gap-1">
                  {activeReactions.slice(0, 3).map((reaction) => {
                    const reactionType = reactionTypes.find((r) => r.id === reaction.id)
                    return (
                      <div key={reaction.id} className="flex items-center">
                        <span className="text-sm">{reactionType?.emoji}</span>
                        <span className="text-xs text-muted-foreground ml-0.5">{reaction.users.length}</span>
                      </div>
                    )
                  })}
                  {activeReactions.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{activeReactions.length - 3}</span>
                  )}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Reactions</h4>
                {activeReactions.map((reaction) => {
                  const reactionType = reactionTypes.find((r) => r.id === reaction.id)
                  const hasCurrentUser = reaction.users.some((user) => user.id === currentUserId)

                  return (
                    <div key={reaction.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{reactionType?.emoji}</span>
                        <span className="font-medium text-sm">{reactionType?.label}</span>
                        <Badge variant="secondary" className="text-xs">
                          {reaction.users.length}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {reaction.users.slice(0, 8).map((user) => (
                          <TooltipProvider key={user.id}>
                            <Tooltip>
                              <TooltipTrigger>
                                <Avatar className={`h-6 w-6 ${user.id === currentUserId ? "ring-2 ring-primary" : ""}`}>
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                  <AvatarFallback className="text-xs">
                                    {user.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{user.id === currentUserId ? "You" : user.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                        {reaction.users.length > 8 && (
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs">
                            +{reaction.users.length - 8}
                          </div>
                        )}
                      </div>
                      {hasCurrentUser && (
                        <p className="text-xs text-muted-foreground">You reacted with {reactionType?.label}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  )
}
