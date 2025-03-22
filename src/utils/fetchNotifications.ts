import api from "@/config/axios.config";

export async function fetchNotifications(
  receiver: string,
  mentorUsername?: string,
) {
  if (!receiver) return [];

  let apiUrl;
  if (mentorUsername)
    apiUrl = `/api/v1/notifications?receiver=${receiver}&listenerUsername=${mentorUsername}`;
  else apiUrl = `/api/v1/notifications?receiver=${receiver}`;

  try {
    const response = await api.get(apiUrl);
    console.log("Notification response - fetchNotifications:", response);

    // if (!response.status.ok) {
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }

    return response.data.data.result;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}
