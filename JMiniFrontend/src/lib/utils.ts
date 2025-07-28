import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatCount(count: number) {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
};

export function getRelativeTime(timestamp: string) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
      
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
      
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
      
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
      
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y ago`;
  };

 export function transformFollowerData(data, action) {
  // Handle empty or null input data gracefully
  if (!data || data.length === 0) {
    // Return a consistent empty structure for both follower and following scenarios
    return { 
      userId: '', 
      username: '', 
      followedAt: '', 
      // Use a generic plural key or dynamically set it if preferred,
      // but a consistent key often simplifies consumer logic.
      connections: [] 
    };
  }

  // Extract common user details from the first item.
  // Assuming 'userId' and 'username' refer to the profile being viewed/transformed.
  const commonUser = {
    userId: data[0].userId,
    username: data[0].username,
    // Take the 'followedAt' or 'followingAt' from the last entry
    // to represent the most recent interaction related to this collection.
    followedAt: data[data.length - 1].followedAt || data[data.length - 1].followingAt, // Assuming 'followedAt' or 'followingAt' will exist
  };

  let connections = []; // Initialize a generic array for the collected items

  // Determine which type of connection to extract based on the action
  if (action === 'follower') {
    // If it's 'follower', map each item to its 'follower' sub-object
    connections = data.map(item => item.follower);
  } else if (action === 'following') {
    // If it's 'following', map each item to its 'followed' sub-object
    // Assuming your data structure for 'following' would have an 'item.followed'
    connections = data.map(item => item.followed); 
  } else {
    // Optional: Handle unknown action or throw an error
    console.warn("Unknown action provided to transformFollowerData:", action);
    // You might want to throw an error or return an empty state here depending on requirements.
    return { 
      ...commonUser, 
      connections: [] 
    };
  }

  return {
    ...commonUser,
    connections: connections // Use a more generic name like 'connections' or 'relatedUsers'
  };
}
