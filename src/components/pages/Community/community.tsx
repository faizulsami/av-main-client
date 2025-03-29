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
  Instagram,
  Linkedin,
} from "lucide-react";
import {
  addCommentToPosts,
  addVote,
  createCommunityPost,
  deleteCommunityPost,
  getAllCommunityPosts,
  getCommunityPost,
  type IComment,
  type ICommunity,
} from "@/services/community.service";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import moment from "moment";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CommunityGuidelinesModal } from "./CommunityGuidelinesModal";

// This is a self-contained component with all necessary UI elements
export default function Community() {
  const [activeTab, setActiveTab] = useState("popular");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [newComment, setNewComment] = useState("");
  const [upvoting, setUpvoting] = useState(false);
  const [posting, setPosting] = useState(false);
  const [guidelinesModalOpen, setGuidelinesModalOpen] = useState(false);
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

    let votedList = JSON.parse(localStorage.getItem("voted-list") || "[]");
    setVotedList(votedList);
    if (votedList && votedList.includes(selectedPost._id)) {
      await addVote(selectedPost._id, "dec");

      toast({
        title: "You are voted remove successfully",
      });
      votedList = votedList.filter(
        (postId: string) => postId !== selectedPost._id,
      );

      localStorage.setItem("voted-list", JSON.stringify(votedList));
      return;
    }

    setUpvoting(true);
    await addVote(selectedPost._id, "inc");

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
    <div className="min-h-screen text-gray-800 p-4 py-12 rounded">
      <div className="mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Posts */}
          <div className="w-full lg:w-2/3">
            <h1 className="text-2xl font-bold mb-6">
              Anonymous Voices{" "}
              <span className="text-purple-600">Community</span>
            </h1>

            {/* Post Input - Replacing "Community Posting Disabled" */}
            <div className="mb-8 bg-white border border-purple-200 rounded-lg overflow-hidden shadow-md">
              <div className="p-6">
                <form onSubmit={handlePostSubmit}>
                  <textarea
                    placeholder="Share something with the community..."
                    className="w-full min-h-[80px] bg-purple-50 border border-purple-200 rounded-md p-3 text-gray-700 resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end">
                    <Button className="bg-soft-paste rounded-md">
                      Post to Anonymous Voices
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Tabs */}
            {/* <div className="flex mb-6 overflow-x-auto border-b border-purple-200">
              <button
                onClick={() => setActiveTab("popular")}
                className={`px-4 py-2 flex items-center ${activeTab === "popular" ? "text-purple-700 border-b-2 border-purple-500" : "text-gray-600 hover:text-purple-600"}`}
              >
                <Flame className="h-4 w-4 mr-2" /> Popular
              </button>
              <button
                onClick={() => setActiveTab("recent")}
                className={`px-4 py-2 ${activeTab === "recent" ? "text-purple-700 border-b-2 border-purple-500" : "text-gray-600 hover:text-purple-600"}`}
              >
                Recent
              </button>
              <button
                onClick={() => setActiveTab("my-posts")}
                className={`px-4 py-2 ${activeTab === "my-posts" ? "text-purple-700 border-b-2 border-purple-500" : "text-gray-600 hover:text-purple-600"}`}
              >
                My Posts
              </button>
              <button
                onClick={() => setActiveTab("all-categories")}
                className={`px-4 py-2 ${activeTab === "all-categories" ? "text-purple-700 border-b-2 border-purple-500" : "text-gray-600 hover:text-purple-600"}`}
              >
                All Categories
              </button>
            </div> */}

            {/* Category Pills */}
            {/* <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center rounded-full border border-purple-300 bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700 hover:bg-purple-200 cursor-pointer">
                Video Editing Tricks
              </span>
              <span className="inline-flex items-center rounded-full border border-teal-300 bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-700 hover:bg-teal-200 cursor-pointer">
                Student Wins
              </span>
              <span className="inline-flex items-center rounded-full border border-purple-300 bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700 hover:bg-purple-200 cursor-pointer">
                Learned Something New Today
              </span>
              <span className="inline-flex items-center rounded-full border border-teal-300 bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-700 hover:bg-teal-200 cursor-pointer">
                Introduce Yourself
              </span>
            </div> */}

            {/* Pinned Posts */}
            {/* <div className="mb-6 flex items-center gap-2 text-purple-600">
              <Flame className="h-4 w-4" />
              <span>Pinned Posts (1)</span>
            </div> */}

            {/* Posts List */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white border border-purple-200 rounded-lg overflow-hidden cursor-pointer hover:border-purple-300 relative shadow-md"
                  onClick={() => handleOpenPost(post._id)}
                >
                  {/* Delete Icon */}
                  {(user?.role === "admin" ||
                    user?.userName === post.author.name) && (
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10 p-1 rounded-full hover:bg-gray-100"
                      onClick={(e) => handleDeletePost(e, post._id)}
                    >
                      {postDeleting._id === post._id &&
                      postDeleting.isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}

                  <div className="p-4 flex flex-row items-start gap-4">
                    <div className="h-12 w-12 rounded-full border border-purple-200 overflow-hidden relative">
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
                        <span className="font-semibold text-gray-800">
                          @{post.author.name}
                        </span>
                        {post.author.role && (
                          <span
                            className={`${post.author.role === "mentee" ? "" : "inline-flex uppercase items-center rounded-full border border-purple-300 bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700"}`}
                          >
                            {post.author.role === "admin"
                              ? "Admin"
                              : post.author.role === "mentor"
                                ? "Listener"
                                : ""}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {moment(post.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 pb-2">
                    <p className="whitespace-pre-line text-gray-700">
                      {post?.content}
                    </p>
                  </div>
                  <div className="flex justify-between border-t border-purple-100 pt-4 px-4 pb-4">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center text-gray-500 hover:text-purple-600 text-sm">
                        <ThumbsUp
                          fill={
                            votedLists.includes(post._id)
                              ? "#8b5cf6"
                              : undefined
                          }
                          className="h-4 w-4 mr-1"
                        />
                        {post?.votes || 0}
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-purple-600 text-sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {post?.comments?.length || 0}
                      </button>
                    </div>
                    <button className="flex items-center text-gray-500 hover:text-purple-600 text-sm">
                      <Link2 className="h-4 w-4 mr-1" />
                      {/* Share */}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Community Info */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white border border-purple-200 rounded-lg overflow-hidden shadow-md">
              <div className="aspect-video relative bg-gradient-to-r from-purple-400 to-teal-300">
                <Image
                  src={"/images/avatar/man.png"}
                  width={48}
                  height={48}
                  alt={"avatar"}
                  className="h-full w-full object-cover opacity-75"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  Anonymous Voices Community
                </h2>
                <p className="text-gray-600 mb-4">
                  built on real-world success and failure.
                </p>

                <button
                  onClick={() => setGuidelinesModalOpen(true)}
                  className="w-full mb-4 flex items-center justify-start px-4 py-2 border border-purple-200 rounded-md text-gray-700 hover:bg-purple-50"
                >
                  <span className="mr-2">📜</span>Rules and Guidelines
                </button>

                <div className="w-full flex items-center justify-start px-4 py-2  rounded-md gap-4 font-bold">
                  <Link
                    href="https://www.facebook.com/share/182B8bbSLb/?mibextid=wwXIfr"
                    target="_blank"
                    className="text-white bg-violet p-1 lg:p-1.5 rounded-md"
                  >
                    <Facebook className="w-3 h-3 md:w-4 md:h-4" />
                  </Link>
                  <Link
                    href="https://www.instagram.com/anonymousvoices_av?igsh=bnEzNWw5OXBpb2lq"
                    target="_blank"
                    className="text-white bg-violet p-1 lg:p-1.5 rounded-md"
                  >
                    <Instagram className="w-3 h-3 md:w-4 md:h-4" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/anonymous-voices/"
                    target="_blank"
                    className="text-white bg-violet p-1 lg:p-1.5 rounded-md"
                  >
                    <Linkedin className="w-3 h-3 md:w-4 md:h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Modal */}
      {postOpening ? (
        <div className="h-screen w-screen fixed flex items-center justify-center top-0 left-0 right-0 bottom-0 bg-purple-900 bg-opacity-30 z-[1000]">
          <Loader2 className="animate-spin text-purple-600" />
        </div>
      ) : (
        selectedPost && (
          <div className="fixed inset-0 bg-purple-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-purple-200 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-6">
                <div className="flex flex-row items-start gap-4 pb-2">
                  <div className="h-12 w-12 rounded-full border border-purple-200 overflow-hidden relative">
                    <Image
                      src={"/images/avatar/man.png"}
                      width={48}
                      height={48}
                      alt={"avatar"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                      @{selectedPost?.author?.name}
                      {selectedPost?.author?.role && (
                        <span
                          className={`${selectedPost.author.role === "mentee" ? "" : "inline-flex uppercase items-center rounded-full border border-purple-300 bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700"}`}
                        >
                          {selectedPost.author.role === "admin"
                            ? "Admin"
                            : selectedPost.author.role === "mentor"
                              ? "Listener"
                              : ""}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {moment(selectedPost.createdAt).fromNow()}
                    </p>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    onClick={handleClosePost}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="py-4">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">
                    {selectedPost.title}
                  </h3>
                  <p className="whitespace-pre-line mb-6 text-gray-700">
                    {selectedPost.content}
                  </p>

                  <div className="flex items-center gap-4 py-2 border-t border-b border-purple-100 mb-6">
                    <button
                      onClick={handleUpvote}
                      disabled={upvoting}
                      className="cursor-pointer flex items-center text-gray-500 hover:text-purple-600 text-sm py-1"
                    >
                      <ThumbsUp
                        fill={
                          votedLists.includes(selectedPost._id)
                            ? "#8b5cf6"
                            : undefined
                        }
                        className="h-4 w-4 mr-1"
                      />
                      {selectedPost?.votes || 0}
                    </button>
                    {/* <button className="flex items-center text-gray-500 hover:text-purple-600 text-sm py-1">
                      <Link2 className="h-4 w-4 mr-1" />
                      Copy Link
                    </button> */}
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-4 text-gray-800">
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
                          className="w-full min-h-[80px] bg-purple-50 border border-purple-200 rounded-md p-3 text-gray-700 resize-none mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <div className="flex justify-end">
                          <Button className="bg-soft-paste rounded-md">
                            Comment
                          </Button>
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
                              <span className="font-semibold text-gray-800">
                                @{comment.author.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                {moment(comment.createdAt).fromNow()}
                              </span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
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
      <CommunityGuidelinesModal
        isOpen={guidelinesModalOpen}
        onClose={() => setGuidelinesModalOpen(false)}
      />
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

//
