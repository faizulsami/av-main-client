import { useState, useEffect } from "react";
import axios from "axios";

const MENTOR_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentors/`;

function useMentorData({ userName }: { userName: string }) {
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userName) {
      setLoading(true);

      axios
        .get(`${MENTOR_API_URL}${userName}`)
        .then((response) => {
          setMentor(response.data.data || {});
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [userName]);

  return { mentor, loading, error };
}

export default useMentorData;
