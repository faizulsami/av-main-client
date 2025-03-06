import axios from "axios";

export const MentorService = {
  getMentorByUsername: async (username: string) => {
    const response = await axios.get(`/api/v1/mentors/${username}`);
    return response.data;
  },
};
