import connectMongoDB from "@/lib/db";
import Stats from "@/models/Stats";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectMongoDB();

      const { interestedUsers, respondedUsers, serviceNeeds } = req.body;

      const result = await Stats.updateOne(
        { _id: "1" },
        {
          $set: {
            interestedUsers: parseInt(interestedUsers, 10),
            respondedUsers: parseInt(respondedUsers, 10),
            serviceNeeds: parseInt(serviceNeeds, 10),
          },
        },
      );

      if (result.modifiedCount > 0) {
        res
          .status(200)
          .json({ success: true, message: "Data updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "No document found" });
      }
    } catch (error) {
      console.error("Error updating stats:", error);
      res.status(500).json({ success: false, message: "Error updating data" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
