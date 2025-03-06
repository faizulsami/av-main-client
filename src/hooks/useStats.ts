import { useState } from "react";
import axios from "axios";
import { ApiResponse, CategoryData } from "@/types/stat.types";

export function useStats() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const fetchStats = async (): Promise<CategoryData> => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>(
        "http://localhost:5000/api/v1/categories",
      );
      const categoryData = response.data.data[0];
      setCategoryId(categoryData?.id ?? null);
      setLoading(false);
      return categoryData;
    } catch (fetchError: any) {
      setLoading(false);
      setError(fetchError.message || "Failed to fetch initial data");
      throw fetchError;
    }
  };

  const saveStats = async (values: CategoryData): Promise<boolean> => {
    setLoading(true);
    try {
      if (!categoryId) {
        throw new Error("Category ID is not available");
      }
      const response = await axios.patch<ApiResponse>(
        `http://localhost:5000/api/v1/categories/${categoryId}`,
        values,
      );
      if (response.status !== 200) {
        throw new Error("Failed to save data");
      }
      setLoading(false);
      return true;
    } catch (saveError: any) {
      setLoading(false);
      setError(saveError.message || "Failed to save data");
      return false;
    }
  };

  return { fetchStats, saveStats, loading, error };
}
