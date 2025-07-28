"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  MessageSquare,
  Heart,
  TrendingUp,
  Search,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  BarChart3,
  Moon,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  joinDate: string
  status: "active" | "suspended" | "pending"
  dreamsCount: number
  likesReceived: number
}

interface Dream {
  id: string
  title: string
  author: string
  category: string
  likes: number
  dislikes: number
  comments: number
  status: "approved" | "pending" | "flagged"
  createdAt: string
}

interface Comment {
  id: string
  content: string
  author: string
  dreamTitle: string
  status: "approved" | "pending" | "flagged"
  createdAt: string
}

export default function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const users: User[] = [
    {
      id: "1",
      name: "Luna Martinez",
      email: "luna@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      joinDate: "2024-01-15",
      status: "active",
      dreamsCount: 24,
      likesReceived: 156,
    },
    {
      id: "2",
      name: "Marcus Chen",
      email: "marcus@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      joinDate: "2024-02-20",
      status: "active",
      dreamsCount: 18,
      likesReceived: 89,
    },
    {
      id: "3",
      name: "Zoe Thompson",
      email: "zoe@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      joinDate: "2024-03-10",
      status: "suspended",
      dreamsCount: 12,
      likesReceived: 45,
    },
  ]

  const dreams: Dream[] = [
    {
      id: "1",
      title: "Flying Through Neon Cities",
      author: "Luna Martinez",
      category: "Lucid",
      likes: 24,
      dislikes: 2,
      comments: 5,
      status: "approved",
      createdAt: "2024-03-15",
    },
    {
      id: "2",
      title: "Talking to My Childhood Pet",
      author: "Marcus Chen",
      category: "Emotional",
      likes: 18,
      dislikes: 0,
      comments: 8,
      status: "approved",
      createdAt: "2024-03-14",
    },
    {
      id: "3",
      title: "Inappropriate Content Dream",
      author: "Anonymous User",
      category: "Normal",
      likes: 2,
      dislikes: 15,
      comments: 3,
      status: "flagged",
      createdAt: "2024-03-13",
    },
  ]

  const comments: Comment[] = [
    {
      id: "1",
      content: "Flying dreams are the best! I love the feeling of freedom.",
      author: "Dream Walker",
      dreamTitle: "Flying Through Neon Cities",
      status: "approved",
      createdAt: "2024-03-15",
    },
    {
      id: "2",
      content: "This is spam content with inappropriate links...",
      author: "Spammer",
      dreamTitle: "Talking to My Childhood Pet",
      status: "flagged",
      createdAt: "2024-03-14",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case "suspended":
      case "flagged":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Flagged</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Lucid":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Lucid</Badge>
      case "Nightmare":
        return <Badge className="bg-pink-100 text-pink-800 border-pink-200">Nightmare</Badge>
      case "Emotional":
        return <Badge className="bg-rose-100 text-rose-800 border-rose-200">Emotional</Badge>
      default:
        return <Badge className="bg-violet-100 text-violet-800 border-violet-200">Normal</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-muted-foreground">Manage your DreamsDoc application</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-purple-500" />
            <span className="text-sm text-muted-foreground">DreamsDoc Admin</span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dreams</CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,678</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23,456</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-violet-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.5%</div>
              <p className="text-xs text-muted-foreground">+3% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="dreams">Dreams</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest user activities on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">New user Luna Martinez joined</span>
                      <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Dream "Flying Through Cities" got 10 likes</span>
                      <span className="text-xs text-muted-foreground ml-auto">4 hours ago</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Comment flagged for review</span>
                      <span className="text-xs text-muted-foreground ml-auto">6 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Moderation</CardTitle>
                  <CardDescription>Items requiring your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Flagged Dreams</span>
                      <Badge className="bg-red-100 text-red-800 border-red-200">3</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pending Comments</span>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">7</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Reports</span>
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">2</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all registered users</CardDescription>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Dreams</TableHead>
                      <TableHead>Likes</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>{user.dreamsCount}</TableCell>
                        <TableCell>{user.likesReceived}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Ban className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dreams Tab */}
          <TabsContent value="dreams" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dream Management</CardTitle>
                <CardDescription>Moderate and manage all dream posts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dreams.map((dream) => (
                      <TableRow key={dream.id}>
                        <TableCell className="font-medium">{dream.title}</TableCell>
                        <TableCell>{dream.author}</TableCell>
                        <TableCell>{getCategoryBadge(dream.category)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <span>👍 {dream.likes}</span>
                            <span>👎 {dream.dislikes}</span>
                            <span>💬 {dream.comments}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(dream.status)}</TableCell>
                        <TableCell>{dream.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Comment Moderation</CardTitle>
                <CardDescription>Review and moderate user comments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Comment</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Dream</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comments.map((comment) => (
                      <TableRow key={comment.id}>
                        <TableCell className="max-w-xs truncate">{comment.content}</TableCell>
                        <TableCell>{comment.author}</TableCell>
                        <TableCell className="max-w-xs truncate">{comment.dreamTitle}</TableCell>
                        <TableCell>{getStatusBadge(comment.status)}</TableCell>
                        <TableCell>{comment.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Monthly user registration trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                      <p className="text-muted-foreground">Chart visualization would go here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dream Categories</CardTitle>
                  <CardDescription>Distribution of dream types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Normal Dreams</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-3/4 h-2 bg-violet-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lucid Dreams</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-1/2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Emotional Dreams</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-1/3 h-2 bg-rose-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">20%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nightmares</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-1/4 h-2 bg-pink-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">10%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Application Settings</CardTitle>
                  <CardDescription>Configure platform settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-moderate content</span>
                    <Button size="sm" variant="outline">
                      Toggle
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email notifications</span>
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">User registration</span>
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Monitor system health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Status</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage</span>
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">75% Used</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
