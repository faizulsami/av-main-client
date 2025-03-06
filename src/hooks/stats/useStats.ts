import { useState } from "react";

interface statsSchema {
  values: {
    interestedUsers: number;
    respondedUsers: number;
    serviceNeeds: number;
  };
}

export function useStats() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function saveStats({ values }: statsSchema) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/updateStats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save stats");
      }

      const data = await response.json();
      return data.success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { saveStats, loading, error };
}
