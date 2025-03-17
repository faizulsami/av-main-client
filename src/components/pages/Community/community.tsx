"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send } from "lucide-react"

// Types for our data
type UserRole = "Admin" | "Moderator" | "Member" | "Guest"

interface User {
  id: string
  name: string
  role: UserRole
  avatar?: string
}

interface Comment {
  id: string
  content: string
  user: User
  createdAt: Date
}

interface Post {
  id: string
  content: string
  user: User
  comments: Comment[]
  createdAt: Date
}

// Sample data
const currentUser: User = {
  id: "1",
  name: "John Doe",
  role: "Member",
  avatar: "/placeholder.svg?height=40&width=40",
}
const initialPosts: Post[] = [
    {
      id: "1",
      content: "Hello everyone! Welcome to our new community platform. Feel free to share your thoughts and ideas here.",
      user: {
        id: "2",
        name: "Jane Smith",
        role: "Admin",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      comments: [
        {
          id: "1",
          content: "This is awesome! Looking forward to connecting with everyone.",
          user: {
            id: "3",
            name: "Mike Johnson",
            role: "Moderator",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          createdAt: new Date("2023-05-15T10:30:00"),
        },
      ],
      createdAt: new Date("2023-05-15T09:00:00"),
    },
    {
      id: "2",
      content:
        "Just finished reading an amazing book on community building. Would highly recommend it to everyone interested in this topic!",
      user: {
        id: "4",
        name: "Sarah Williams",
        role: "Member",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      comments: [],
      createdAt: new Date("2023-05-14T15:45:00"),
    },
  ]

  export function Community() {
    const [posts, setPosts] = useState<Post[]>(initialPosts)
    const [newPostContent, setNewPostContent] = useState("")
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [newComment, setNewComment] = useState("")
  
    // Format date to a readable string
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    }
  
    // Create a new post
    const handleCreatePost = () => {
      if (!newPostContent.trim()) return
  
      const newPost: Post = {
        id: Date.now().toString(),
        content: newPostContent,
        user: currentUser,
        comments: [],
        createdAt: new Date(),
      }
  
      setPosts([newPost, ...posts])
      setNewPostContent("")
    }
  
    // Add a comment to a post
    const handleAddComment = () => {
      if (!newComment.trim() || !selectedPost) return
  
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        content: newComment,
        user: currentUser,
        createdAt: new Date(),
      }
  
      const updatedPosts = posts.map((post) => {
        if (post.id === selectedPost.id) {
          return {
            ...post,
            comments: [...post.comments, newCommentObj],
          }
        }
        return post
      })
  
      setPosts(updatedPosts)
      setSelectedPost(updatedPosts.find((post) => post.id === selectedPost.id) || null)
      setNewComment("")
    }

    return (
        <div className="container mx-auto py-6 max-w-3xl">
          <h1 className="text-2xl font-bold mb-6">Community Feed</h1>
    
          {/* Create Post Form */}
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="pb-3 border-b">
              <h2 className="text-lg font-semibold">Create Post</h2>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-start gap-4">
                <Avatar className="mt-1">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{currentUser.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {currentUser.role}
                    </Badge>
                  </div>
                  <Textarea
                    placeholder="What would you like to share with the community today?"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="min-h-[100px] focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  {newPostContent.length > 0 && (
                    <div className="text-xs text-muted-foreground text-right">{newPostContent.length} characters</div>
                  )}
                </div>
              </div>
              </CardContent>
        <CardFooter className="flex justify-end bg-muted/30 border-t">
          <Button onClick={handleCreatePost} disabled={!newPostContent.trim()} className="px-6">
            Post
          </Button>
        </CardFooter>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
              <Avatar>
                <AvatarImage src={post.user.avatar} alt={post.user.name} />
                <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{post.user.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {post.user.role}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
              </div>
            </CardHeader>
            <CardContent onClick={() => setSelectedPost(post)}>
              <p className="whitespace-pre-line">{post.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setSelectedPost(post)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                {post.comments.length} {post.comments.length === 1 ? "Comment" : "Comments"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>