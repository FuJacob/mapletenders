import { Request, Response } from "express";
import { DatabaseService } from "../services";
import emailService from "../services/emailService";

export class AuthController {
  constructor(private databaseService: DatabaseService) {}

  signUp = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required",
        });
      }

      const data = await this.databaseService.signUpUser(email, password);
      
      // Send welcome email
      try {
        const userName = data.user?.user_metadata?.full_name || email.split('@')[0];
        await emailService.sendWelcomeEmail(email, userName);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the signup if email fails
      }
      
      res.json(data);
    } catch (error: any) {
      console.error("Error in signUp:", error);
      res.status(400).json({ error: error.message || "Failed to sign up" });
    }
  };

  signIn = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required",
        });
      }

      const data = await this.databaseService.signInUser(email, password);
      res.json(data);
    } catch (error: any) {
      console.error("Error in signIn:", error);
      res.status(400).json({ error: error.message || "Failed to sign in" });
    }
  };

  signOut = async (req: Request, res: Response) => {
    try {
      const result = await this.databaseService.signOutUser();
      res.json(result);
    } catch (error: any) {
      console.error("Error in signOut:", error);
      res.status(500).json({ error: error.message || "Failed to sign out" });
    }
  };

  getUser = async (req: Request, res: Response) => {
    try {
      const user = await this.databaseService.getUser();
      res.json(user);
    } catch (error: any) {
      console.error("Error in getUser:", error);
      res.status(500).json({ error: error.message || "Failed to get session" });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          error: "Email is required",
        });
      }

      const data = await this.databaseService.resetPasswordForEmail(
        email,
        `${process.env.FRONTEND_URL}/update-password`
      );

      // Send custom password reset email via Resend
      try {
        // Use the frontend URL for password reset (Supabase handles the token via email)
        const resetLink = `${process.env.FRONTEND_URL}/update-password`;
        await emailService.sendPasswordResetEmail(email, resetLink);
      } catch (emailError) {
        console.error('Failed to send password reset email via Resend:', emailError);
      }

      res.json({
        message: "Password reset email sent successfully",
        data,
      });
    } catch (error: any) {
      console.error("Error in resetPassword:", error);
      res.status(400).json({
        error: error.message || "Failed to send password reset email",
      });
    }
  };

  updatePassword = async (req: Request, res: Response) => {
    try {
      const { password, accessToken } = req.body;

      if (!password) {
        return res.status(400).json({
          error: "Password is required",
        });
      }

      if (!accessToken) {
        return res.status(400).json({
          error: "Access token is required",
        });
      }

      const data = await this.databaseService.updateUserPassword(
        accessToken,
        password
      );

      res.json({
        message: "Password updated successfully",
        data,
      });
    } catch (error: any) {
      console.error("Error in updatePassword:", error);
      res.status(400).json({
        error: error.message || "Failed to update password",
      });
    }
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const authHeader = req.headers.authorization;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: "Current password and new password are required",
        });
      }

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          error: "Authentication required",
        });
      }

      const token = authHeader.split(" ")[1];
      
      const data = await this.databaseService.changeUserPassword(
        token,
        currentPassword,
        newPassword
      );

      res.json({
        message: "Password changed successfully",
        data,
      });
    } catch (error: any) {
      console.error("Error in changePassword:", error);
      res.status(400).json({
        error: error.message || "Failed to change password",
      });
    }
  };
}
