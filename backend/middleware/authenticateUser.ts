import { NextFunction, Request, Response } from "express";
import { DatabaseService } from "../services/databaseService";

const databaseService = new DatabaseService();
const supabase = databaseService.getSupabaseClient();

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  console.log("Auth middleware - Request URL:", req.url);
  console.log("Auth middleware - Token present:", !!token);
  console.log("Auth middleware - Token length:", token.length);

  if (!token) {
    console.log("Auth middleware - Missing token");
    res.status(401).json({ error: "Missing token" });
    return;
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      console.log("Auth middleware - Supabase error:", error.message);
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    if (!data.user) {
      console.log("Auth middleware - No user data returned");
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const userId = data.user.id;
    console.log("Auth middleware - Authenticated user:", userId, data.user.email);
    
    // Set user data on request object (not headers for security)
    (req as any).user = {
      ...data.user,
      id: userId, // Ensure our userId takes precedence
    };
    
    next();
  } catch (err) {
    console.error("Auth middleware - Unexpected error:", err);
    res.status(401).json({ error: "Authentication failed" });
    return;
  }
};
