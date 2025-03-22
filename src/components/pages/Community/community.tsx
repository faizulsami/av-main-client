"use client"

import type React from "react"
import { useState } from "react"
import { Facebook, MessageSquare, ThumbsUp, Link2, X, Flame, Trash2 } from "lucide-react"

// This is a self-contained component with all necessary UI elements
export default function Community() {
  const [activeTab, setActiveTab] = useState("popular")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [newPostContent, setNewPostContent] = useState("")
  const [newComment, setNewComment] = useState("")
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: {
        name: "Team Dropout Skool",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Moderator",
      },
      date: "Jan 4, 2025, 09:20 PM",
      title: "☠️ War against piracy ☠️",
      content: `Hey everyone! 👋

You might have noticed some people trying to pirate our course on Facebook or other social media platforms.

Wherever you see such links, please drop them in the comments below or send them directly to the admins. 📩 Your small help will play a big role in our war against piracy.

Thank you so much for your support! 🙏 ❤️
Together, we can keep this community safe and strong! 🚀`,
      votes: 65,
      comments: [
        {
          id: "c1",
          author: {
            name: "Nageeb",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          date: "3/10/2025",
          content: "hi I am nageeb mohammad from team14. I am having payment problems. Pls help. 01706368011",
        },
        {
          id: "c2",
          author: {
            name: "Waliur Rahman",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          date: "3/6/2025",
          content: "",
        },
      ],
    },
  ])

  const handleOpenPost = (post: Post) => {
    setSelectedPost(post)
  }

  const handleClosePost = () => {
    setSelectedPost(null)
  }

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostContent.trim()) return

    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: new Date().toLocaleString(),
      title: newPostContent.split("\n")[0] || "New Post",
      content: newPostContent,
      votes: 0,
      comments: [],
    }

    setPosts([newPost, ...posts])
    setNewPostContent("")
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPost || !newComment.trim()) return

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: new Date().toLocaleString(),
      content: newComment,
    }

    const updatedPost = {
      ...selectedPost,
      comments: [...selectedPost.comments, newCommentObj],
    }

    setPosts(posts.map((post) => (post.id === selectedPost.id ? updatedPost : post)))
    setSelectedPost(updatedPost)
    setNewComment("")
  }

  const handleDeletePost = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation() // Prevent opening the post modal
    setPosts(posts.filter((post) => post.id !== postId))
    if (selectedPost?.id === postId) {
      setSelectedPost(null)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 py-12 rounded">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Posts */}
          <div className="w-full lg:w-2/3">
            <h1 className="text-2xl font-bold mb-6">
              Dropouts <span className="text-red-500">Community</span>
            </h1>

            {/* Post Input - Replacing "Community Posting Disabled" */}
            <div className="mb-8 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <div className="p-6">
                <form onSubmit={handlePostSubmit}>
                  <textarea
                    placeholder="Share something with the community..."
                    className="w-full min-h-[80px] bg-gray-800 border border-gray-700 rounded-md p-3 text-white resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium text-sm"
                    >
                      Post to Community
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex mb-6 overflow-x-auto border-b border-gray-800">
              <button
                onClick={() => setActiveTab("popular")}
                className={`px-4 py-2 flex items-center ${activeTab === "popular" ? "text-white border-b-2 border-orange-500" : "text-gray-400 hover:text-white"}`}
              >
                <Flame className="h-4 w-4 mr-2" /> Popular
              </button>
              <button
                onClick={() => setActiveTab("recent")}
                className={`px-4 py-2 ${activeTab === "recent" ? "text-white border-b-2 border-orange-500" : "text-gray-400 hover:text-white"}`}
              >
                Recent
              </button>
              <button
                onClick={() => setActiveTab("my-posts")}
                className={`px-4 py-2 ${activeTab === "my-posts" ? "text-white border-b-2 border-orange-500" : "text-gray-400 hover:text-white"}`}
              >
                My Posts
              </button>
              <button
                onClick={() => setActiveTab("all-categories")}
                className={`px-4 py-2 ${activeTab === "all-categories" ? "text-white border-b-2 border-orange-500" : "text-gray-400 hover:text-white"}`}
              >
                All Categories
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800 px-2.5 py-0.5 text-xs font-semibold text-white hover:bg-gray-700 cursor-pointer">
                Video Editing Tricks
              </span>
              <span className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800 px-2.5 py-0.5 text-xs font-semibold text-white hover:bg-gray-700 cursor-pointer">
                Student Wins
              </span>
              <span className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800 px-2.5 py-0.5 text-xs font-semibold text-white hover:bg-gray-700 cursor-pointer">
                Learned Something New Today
              </span>
              <span className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800 px-2.5 py-0.5 text-xs font-semibold text-white hover:bg-gray-700 cursor-pointer">
                Introduce Yourself
              </span>
            </div>

            {/* Pinned Posts */}
            <div className="mb-6 flex items-center gap-2 text-orange-500">
              <Flame className="h-4 w-4" />
              <span>Pinned Posts (1)</span>
            </div>

            {/* Posts List */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden cursor-pointer hover:border-gray-700 relative"
                  onClick={() => handleOpenPost(post)}
                >
                  {/* Delete Icon */}
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10 p-1 rounded-full hover:bg-gray-800"
                    onClick={(e) => handleDeletePost(e, post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="p-4 flex flex-row items-start gap-4">
                    <div className="h-12 w-12 rounded-full border border-gray-700 overflow-hidden relative">
                      <img
                        src={post.author.avatar || "/placeholder.svg"}
                        alt={post.author.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{post.author.name}</span>
                        {post.author.role && (
                          <span className="inline-flex items-center rounded-full border border-blue-700 bg-blue-900 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
                            {post.author.role}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{post.date}</p>
                    </div>
                  </div>
                  <div className="px-4 pb-2">
                    <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                    <p className="whitespace-pre-line">{post.content}</p>
                  </div>
                  <div className="flex justify-between border-t border-gray-800 pt-4 px-4 pb-4">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center text-gray-400 hover:text-white text-sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {post.votes}
                      </button>
                      <button className="flex items-center text-gray-400 hover:text-white text-sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {post.comments.length}
                      </button>
                    </div>
                    <button className="flex items-center text-gray-400 hover:text-white text-sm">
                      <Link2 className="h-4 w-4 mr-1" />
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Community Info */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src="/placeholder.svg?height=300&width=500"
                  alt="Community"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">Dropouts Community</h2>
                <p className="text-gray-400 mb-4">built on real-world success and failure.</p>

                <button className="w-full mb-4 flex items-center justify-start px-4 py-2 border border-gray-700 rounded-md text-white hover:bg-gray-800">
                  <span className="mr-2">📜</span> Rules and Guidelines
                </button>

                <button className="w-full flex items-center justify-start px-4 py-2 border border-gray-700 rounded-md text-blue-400 hover:bg-gray-800">
                  <Facebook className="h-4 w-4 mr-2" /> Follow Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex flex-row items-start gap-4 pb-2">
                <div className="h-12 w-12 rounded-full border border-gray-700 overflow-hidden relative">
                  <img
                    src={selectedPost.author.avatar || "/placeholder.svg"}
                    alt={selectedPost.author.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold flex items-center gap-2">
                    {selectedPost.author.name}
                    {selectedPost.author.role && (
                      <span className="inline-flex items-center rounded-full border border-blue-700 bg-blue-900 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
                        {selectedPost.author.role}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{selectedPost.date}</p>
                </div>
                <button
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
                  onClick={handleClosePost}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="py-4">
                <h3 className="text-xl font-bold mb-4">{selectedPost.title}</h3>
                <p className="whitespace-pre-line mb-6">{selectedPost.content}</p>

                <div className="flex items-center gap-4 py-2 border-t border-b border-gray-800 mb-6">
                  <button className="flex items-center text-gray-400 hover:text-white text-sm py-1">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {selectedPost.votes}
                  </button>
                  <button className="flex items-center text-gray-400 hover:text-white text-sm py-1">
                    <Link2 className="h-4 w-4 mr-1" />
                    Copy Link
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-4">Comments ({selectedPost.comments.length})</h4>

                  <div className="flex gap-4 mb-6">
                    <div className="h-10 w-10 rounded-full overflow-hidden relative">
                      <img src="/placeholder.svg?height=40&width=40" alt="You" className="h-full w-full object-cover" />
                    </div>
                    <form onSubmit={handleCommentSubmit} className="flex-1">
                      <textarea
                        placeholder="Write a comment..."
                        className="w-full min-h-[80px] bg-gray-800 border border-gray-700 rounded-md p-3 text-white resize-none mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium text-sm"
                        >
                          Post Comment
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="space-y-6">
                    {selectedPost.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4">
                        <div className="h-10 w-10 rounded-full overflow-hidden relative">
                          <img
                            src={comment.author.avatar || "/placeholder.svg"}
                            alt={comment.author.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold">{comment.author.name}</span>
                            <span className="text-sm text-gray-400">{comment.date}</span>
                          </div>
                          <p>{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Types
interface Post {
  id: string
  author: {
    name: string
    avatar: string
    role?: string
  }
  date: string
  title: string
  content: string
  votes: number
  comments: Comment[]
}

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
  }
  date: string
  content: string
}

