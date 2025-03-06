"use client";
import React, { useEffect, useState } from "react";
import { StatsSection } from "./StatsSection";
import { StatTypes } from "@/types/stat.types";
import { fetchStats } from "@/services/stats.service";
import { Skeleton } from "@/components/ui/skeleton";

const Stat = () => {
  const [stats, setStats] = useState<StatTypes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchStats();
        if (data) {
          setStats([
            {
              icon: "users",
              value: data.interestedUsers || "0",
              label: "Interested Users",
            },
            {
              icon: "check",
              value: data.respondedUsers || "0",
              label: "Responded Users",
            },
            {
              icon: "heart",
              value: data.serviceNeedsTo || "0",
              label: "Need The Service",
            },
          ]);
        }
      } catch (error) {
        console.log("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-8">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return <StatsSection stats={stats} />;
};

export default Stat;
