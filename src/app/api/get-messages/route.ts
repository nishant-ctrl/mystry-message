import { getServerSession, User } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !user) {
        return Response.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
    }
    try {
        const userId = new mongoose.Types.ObjectId(user._id);
        const userWithMessages = await UserModel.aggregate([
            {
                $match: {
                    _id: userId,
                },
            },
            {
                $unwind: "$messages",
            },
            {
                $sort: { "messages.createdAt": -1 },
            },
            {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages",
                    },
                },
            },
        ]);
        // console.log(userWithMessages)
        if (!userWithMessages) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 400 }
            );
        }
        if (userWithMessages.length === 0) {
            return Response.json(
                { success: false, message: "No messages" },
                { status: 404 }
            );
        }
        return Response.json(
            { success: true, messages: userWithMessages[0].messages },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { success: false, message: "Not authenticated" },
            { status: 500 }
        );
    }
}
