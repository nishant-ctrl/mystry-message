import UserModel from "@/model/user.model";
import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(req: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const queryParam = {
            username: searchParams.get("username"),
        };
        //zod validation
        const result = UsernameQuerySchema.safeParse(queryParam);
        // console.log(result);
        if (!result.success) {
            // const usernameErrors = result.error.format().username?._errors || [];
            const tree = z.treeifyError(result.error); // zod v4
            const usernameErrors = tree.properties?.username?.errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        usernameErrors?.length > 0
                            ? usernameErrors.join(",")
                            : "Invalid query parameters",
                },
                { status: 400 }
            );
        }
        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        });
        if (existingVerifiedUser) {
            return Response.json(
                { success: false, message: "Username is alteady taken" },
                { status: 500 }
            );
        }
        return Response.json(
            { success: true, message: "Username is available" },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error checking username: ", error);
        return Response.json(
            { success: false, message: "Error checking username" },
            { status: 500 }
        );
    }
}
