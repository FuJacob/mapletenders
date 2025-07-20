import { createClient } from "@supabase/supabase-js";
import { NextFunction, Request, Response } from "express";

// This is a service key, *never* expose in frontend
export const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Missing token" });
    return;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  const userId = data.user.id;
  console.log("data", userId);
  req.headers.userId = userId;
  next();
};
