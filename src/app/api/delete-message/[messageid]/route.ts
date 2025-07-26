import { getServerSession, User } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";


export async function DELETE(req: Request,{params}:{params:{messageid:string}}) {
    const messageId=params.messageid

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
        const updatedResult=await UserModel.updateOne(
            {_id:user._id},
            {$pull:{messages:{_id:messageId}}},
        )
        if(updatedResult.matchedCount==0){
            return Response.json(
                { success: false, message: "Message not found or already deleted" },
                { status: 404 }
            );
        }
        return Response.json(
            { success: true, message: "Message deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { success: false, message: "Error deleting message" },
            { status: 500 }
        );
    }
    
}
