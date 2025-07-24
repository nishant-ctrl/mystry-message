import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, content } = await req.json();
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User not accepting messages right now",
                },
                { status: 403 }
            );
        }
        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json(
            { success: true, message: "Message sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { success: false, message: "Error while sending message" },
            { status: 500 }
        );
    }
}
