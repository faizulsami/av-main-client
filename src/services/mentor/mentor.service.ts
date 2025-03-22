import api from "@/config/axios.config";
import { MentorFormValues } from "@/types/mentor.types";
import { get_socket } from "@/utils/get-socket";

export async function registerMentor(values: MentorFormValues) {
  try {
    // Filter only available slots
    const availableSlots = values.mentor.availability.filter(
      (slot) => slot.isAvailable,
    );

    // Transform the values to match the API requirements
    const transformedValues = {
      userName: values.userName,
      password: values.password,
      mentor: {
        ...values.mentor,
        availability: availableSlots,
        activeStatus: values.mentor.activeStatus,
      },
    };

    // Send the POST request to create the mentor
    const result = await api.post(
      "/api/v1/users/create-mentor",
      transformedValues,
    );

    // Parse the response data
    const responseData = JSON.parse(result.config.data);

    const userName = responseData.userName;

    console.log("Sending notification to admin");

    // Emit a socket event to notify the admin about the new mentor request
    if (userName) {
      const socket = get_socket();

      socket.emit("notification", {
        receiver: "admin",
        type: "mentor_request",
        content: `A new listener request has been created by ${userName}.`,
      });

      console.log({ socket });

      await api.post("/api/v1/notifications/create-notification", {
        receiver: "admin",
        type: "mentor_request",
        content: `A new listener request has been created by ${userName}.`,
        isSeen: false,
      });
    }

    return result;
  } catch (error) {
    console.error("Error while registering listener:", error);
    throw error;
  }
}
