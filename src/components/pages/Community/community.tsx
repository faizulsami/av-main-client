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