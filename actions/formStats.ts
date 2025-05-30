"use server";

import { currentUser } from "@clerk/nextjs/server";
import { Form } from "@/models/Form";
import connectDb from "@/lib/mongodb";


export const getFormStats = async () => {
  try {
    await connectDb();
    const user = await currentUser();

    if (!user || !user.id) {
      console.log("User not found");
      return;
    }

    const stats = await Form.aggregate([
      {
        $match: {
          ownerId: user.id,
        },
      },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: "$submissions" },
        },
      },
    ]);
    
    const submissions = stats[0]?.totalSubmissions || 0;
    console.log("Submissions count : ",submissions);
    return submissions;
  } catch (err) {
    console.log("Error displaying formStats:", err);
  }
};