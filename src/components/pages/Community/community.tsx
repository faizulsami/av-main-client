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