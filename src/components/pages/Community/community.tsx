/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Facebook,
  MessageSquare,
  ThumbsUp,
  Link2,
  X,
  Flame,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  addCommentToPosts,
  addVote,
  createCommunityPost,
  deleteCommunityPost,
  getAllCommunityPosts,
  getCommunityPost,
  IComment,
  ICommunity,
} from "@/services/community.service";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import moment from "moment";
import { useToast } from "@/hooks/use-toast";

// This is a self-contained component with all necessary UI elements
export default function Community() {
  const [activeTab, setActiveTab] = useState("popular");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [newComment, setNewComment] = useState("");
  const [upvoting, setUpvoting] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postOpening, setPostOpening] = useState(false);
  const [postDeleting, setPostDeleting] = useState({
    _id: "",
    isLoading: false,
  });
  const [posts, setPosts] = useState<ICommunity[]>([]);
  const [votedLists, setVotedList] = useState([]);

  const { toast } = useToast();
  const { user } = useAuth();

  const handleOpenPost = async (postId: string) => {
    setPostOpening(true);
    const res = await getCommunityPost(postId);
    setPostOpening(false);
    console.log({ res: res });
    setSelectedPost(res.data);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
  };

  useEffect(() => {
    const getPosts = async () => {
      const response = await getAllCommunityPosts();
      setPosts(response?.data || []);
    };
    const votedList = JSON.parse(localStorage.getItem("voted-list") || "[]");
    setVotedList(votedList);

    getPosts();
  }, []);

  const handleUpvote = async () => {
    if (!selectedPost) return;

    const votedList = JSON.parse(localStorage.getItem("voted-list") || "[]");
    setVotedList(votedList);
    if (votedList && votedList.includes(selectedPost._id)) {
      toast({
        title: "You are already voted",
        variant: "destructive",
      });
      return;
    }

    setUpvoting(true);
    await addVote(selectedPost._id);
    setUpvoting(false);
    votedList.push(selectedPost._id);

    toast({ title: "You are voted successfully" });

    localStorage.setItem("voted-list", JSON.stringify(votedList));
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPostContent.trim() || !user) return;

    const newPost: ICommunity = {
      author: {
        name: user.userName,
        role: user.role,
      },
      content: newPostContent,
    };
    setPosting(true);
    const res = await createCommunityPost(newPost);
    if (res?.data?._id) setPosts([res?.data, ...posts]);
    setPosting(false);
    setNewPostContent("");
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newComment.trim() || !user) return;

    const newCommentObj: IComment = {
      author: {
        name: user?.userName,
        role: user?.role,
      },
      content: newComment,
    };

    const res = await addCommentToPosts(selectedPost._id, newCommentObj);

    if (!res?.data._id) {
      toast({ title: "failed post to comment", variant: "destructive" });
      return;
    }

    setSelectedPost(res?.data);
    setPosts(
      posts.map((post: any) =>
        post._id === selectedPost._id ? res?.data : post,
      ),
    );

    setNewComment("");
  };

  const handleDeletePost = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setPostDeleting({ _id: postId, isLoading: true });
    const data = await deleteCommunityPost(postId);
    setPostDeleting({ _id: postId, isLoading: false });
    if (data) {
      setPosts(posts.filter((post) => post._id !== postId));
      if (selectedPost?._id === postId) {
        setSelectedPost(null);
      }
    }
  };

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
                      disabled={posting}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium text-sm"
                    >
                      {posting ? "Posting to Community" : "Post to Community"}
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
                  key={post._id}
                  className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden cursor-pointer hover:border-gray-700 relative"
                  onClick={() => handleOpenPost(post._id)}
                >
                  {/* Delete Icon */}
                  {(user?.role === "admin" ||
                    user?.userName === post.author.name) && (
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10 p-1 rounded-full hover:bg-gray-800"
                      onClick={(e) => handleDeletePost(e, post._id)}
                    >
                      {postDeleting._id === post._id &&
                      postDeleting.isLoading ? (
                        <Loader2 className="animate-spine" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}

                  <div className="p-4 flex flex-row items-start gap-4">
                    <div className="h-12 w-12 rounded-full border border-gray-700 overflow-hidden relative">
                      <Image
                        src={"/images/avatar/man.png"}
                        width={48}
                        height={48}
                        alt={"avatar"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold ">
                          @{post.author.name}
                        </span>
                        {post.author.role && (
                          <span className="inline-flex uppercase items-center rounded-full border border-blue-700 bg-blue-900 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
                            {post.author.role}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {moment(post.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 pb-2">
                    <p className="whitespace-pre-line">{post?.content}</p>
                  </div>
                  <div className="flex justify-between border-t border-gray-800 pt-4 px-4 pb-4">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center text-gray-400 hover:text-white text-sm">
                        <ThumbsUp
                          fill={
                            votedLists.includes(post._id)
                              ? "#ffffff"
                              : undefined
                          }
                          className="h-4 w-4 mr-1"
                        />
                        {post?.votes || 0}
                      </button>
                      <button className="flex items-center text-gray-400 hover:text-white text-sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {post?.comments?.length || 0}
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
                <Image
                  src={"/images/avatar/man.png"}
                  width={48}
                  height={48}
                  alt={"avatar"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">Dropouts Community</h2>
                <p className="text-gray-400 mb-4">
                  built on real-world success and failure.
                </p>

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
      {postOpening ? (
        <div className="h-screen w-screen fixed flex items-center justify-center top-0 left-0 right-0 bottom-0 bg-black opacity-30 z-[1000]">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        selectedPost && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-black border border-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex flex-row items-start gap-4 pb-2">
                  <div className="h-12 w-12 rounded-full border border-gray-700 overflow-hidden relative">
                    <Image
                      src={"/images/avatar/man.png"}
                      width={48}
                      height={48}
                      alt={"avatar"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold flex items-center gap-2">
                      @{selectedPost?.author?.name}
                      {selectedPost?.author?.role && (
                        <span className="inline-flex uppercase items-center rounded-full border border-blue-700 bg-blue-900 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
                          {selectedPost?.author.role}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {moment(selectedPost.createdAt).fromNow()}
                    </p>
                  </div>
                  <button
                    className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
                    onClick={handleClosePost}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="py-4">
                  <h3 className="text-xl font-bold mb-4">
                    {selectedPost.title}
                  </h3>
                  <p className="whitespace-pre-line mb-6">
                    {selectedPost.content}
                  </p>

                  <div className="flex items-center gap-4 py-2 border-t border-b border-gray-800 mb-6">
                    <button
                      onClick={handleUpvote}
                      disabled={upvoting}
                      className="cursor-pointer flex items-center text-gray-400 hover:text-white text-sm py-1"
                    >
                      <ThumbsUp
                        fill={
                          votedLists.includes(selectedPost._id)
                            ? "#ffffff"
                            : undefined
                        }
                        className="h-4 w-4 mr-1"
                      />
                      {selectedPost?.votes || 0}
                    </button>
                    <button className="flex items-center text-gray-400 hover:text-white text-sm py-1">
                      <Link2 className="h-4 w-4 mr-1" />
                      Copy Link
                    </button>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-4">
                      Comments ({selectedPost?.comments?.length || 0})
                    </h4>

                    <div className="flex gap-4 mb-6">
                      <div className="h-10 w-10 rounded-full overflow-hidden relative">
                        <Image
                          src={"/images/avatar/man.png"}
                          width={48}
                          height={48}
                          alt={"avatar"}
                          className="h-full w-full object-cover"
                        />
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
                      {selectedPost?.comments?.map((comment) => (
                        <div key={comment._id} className="flex gap-4">
                          <div className="h-10 w-10 rounded-full overflow-hidden relative">
                            <Image
                              src={"/images/avatar/man.png"}
                              width={48}
                              height={48}
                              alt={"avatar"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold">
                                @{comment.author.name}
                              </span>
                              <span className="text-sm text-gray-400">
                                {moment(comment.createdAt).fromNow()}
                              </span>
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
        )
      )}
    </div>
  );
}

// Types
interface Post {
  _id: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  date: string;
  title: string;
  content: string;
  votes: number;
  comments: Comment[];
}

interface Comment {
  _id: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  content: string;
}
