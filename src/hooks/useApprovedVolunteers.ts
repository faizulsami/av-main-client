/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Volunteer } from "@/types/volunteer";
import { useEffect, useState } from "react";
import api from "@/config/axios.config";
import { get_socket } from "@/utils/get-socket";

const useApprovedVolunteers = <T extends Volunteer[]>() => {
  const [approvedVolunteers, setApprovedVolunteers] = useState<T>(
    [] as unknown as T,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const socket = get_socket();
    setSocket(socket);
    const fetchVolunteers = async () => {
      try {
        const response = await api.get("/api/v1/mentors?adminApproval=true");
        const approved = response.data.data;

        setApprovedVolunteers(approved as T);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("mentor-online", (data: any) => {
      setApprovedVolunteers((prev: any) => {
        return prev.map((volunteer: { userName: any }) => {
          if (volunteer.userName === data.username) {
            return { ...volunteer, isOnline: data.isOnline };
          }
          return volunteer;
        });
      });
    });
  }, [socket]);

  return { approvedVolunteers, loading, error };
};

export default useApprovedVolunteers;
