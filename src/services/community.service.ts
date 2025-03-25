/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import api from "@/config/axios.config";
import { AxiosError } from "axios";

export interface IAuthor {
  name: string;
  role: string;
}

export interface IComment {
  author: IAuthor;
  content: string;
}

export interface ICommunity {
  author: IAuthor;
  content: string;
  votes?: number;
  comments?: IComment[];
}

export const createCommunityPost = async (CommunityPostData: ICommunity) => {
  try {
    const response = await api.post(
      "/api/v1/community/create-post",
      CommunityPostData,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Axios Error Details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    throw error;
  }
};
export const getAllCommunityPosts = async () => {
  try {
    const response = await api.get("/api/v1/community");
    return response.data;
  } catch (err: any) {
    return [];
  }
};
export const getCommunityPost = async (id: string) => {
  try {
    const response = await api.get(`/api/v1/community/${id}`);
    return response.data;
  } catch (err: any) {
    return null;
  }
};

export const addCommentToPosts = async (id: string, comment: any) => {
  try {
    const response = await api.put(
      `/api/v1/community/add-comment/${id}`,
      comment,
    );
    return response.data;
  } catch (err: any) {
    return [];
  }
};
export const addVote = async (id: string) => {
  try {
    const response = await api.put(`/api/v1/community/add-vote/${id}`);
    return response.data;
  } catch (err: any) {
    return null;
  }
};
export const deleteCommunityPost = async (id: string) => {
  try {
    const response = await api.delete(`/api/v1/community/${id}`);
    return response.data?.data || null;
  } catch (err: any) {
    return null;
  }
};
