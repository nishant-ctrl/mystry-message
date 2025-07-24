import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, code } = await req.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 400 }
            );
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        if (isCodeValid || isCodeNotExpired) {
            // user.isVerified = true;
            // user.verifyCode=null;
            // user.verifyCodeExpiry=null;
            // await user.save();
            await UserModel.updateOne(
                { _id: user._id },
                {
                    $set: { isVerified: true },
                    $unset: {
                        verifyCode: "",
                        verifyCodeExpiry: "",
                    },
                }
            );

            return Response.json(
                { success: true, message: "Account verified successfully" },
                { status: 200 }
            );
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Verification code is expired. Please signup again to get a new code",
                },
                { status: 400 }
            );
        } else {
            return Response.json(
                { success: false, message: "Verification code is wrong" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.log("Error verifying user: ", error);
        return Response.json(
            { success: false, message: "Error verifying user" },
            { status: 500 }
        );
    }
}
