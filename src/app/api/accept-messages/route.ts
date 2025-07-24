import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";

export async function POST(req: Request) {
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
        const userId = user._id;
        const { acceptMessages } = await req.json();
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        ).select("-password");
        if (!updatedUser) {
            return Response.json(
                { success: false, message: "Failed to update user status" },
                { status: 401 }
            );
        }
        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated sucessfully",
                user: updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { success: false, message: "Not authenticated" },
            { status: 500 }
        );
    }
}

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
        const userId = user._id;
        const foundUser = await UserModel.findById(userId).select("-password");
        if (!foundUser) {
            return Response.json(
                { success: false, message: "Failed to found user" },
                { status: 404 }
            );
        }
        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated sucessfully",
                isAcceptingMessages: foundUser.isAcceptingMessage,
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { success: false, message: "Not authenticated" },
            { status: 500 }
        );
    }
}

