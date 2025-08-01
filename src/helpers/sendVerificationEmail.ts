import { resend } from "@/lib/resend";
import verificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: "knishant9135@gmail.com",
            subject: "Mystry message | Verification Code",
            react: verificationEmail({ username, otp: verifyCode }),
        });
        return {
            success: true,
            message: "Verification email sent successfully",
        };
    } catch (emailError) {
        console.error("Error sending verification email: ", emailError);
        return { success: false, message: "Failed to send verification error" };
    }
}
