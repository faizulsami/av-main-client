import { ApiResponse } from "@/types/stat.types";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`;

export const fetchStats = async () => {
  try {
    const response = await axios.get<ApiResponse>(API_URL);
    return response.data.data[0] || {};
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};
