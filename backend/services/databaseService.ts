import { createClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";

export class DatabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient<Database>(
      process.env.SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_KEY || ""
    );
  }

  async getTendersFromBookmarkIds(bookmarkIds: string[]) {
    return await this.supabase
      .from("tenders")
      .select("*")
      .in("id", bookmarkIds);
  }

  async updateTenderSummary(tenderId: string, summary: string) {
    return await this.supabase
      .from("tenders")
      .update({
        summary,
      })
      .eq("id", tenderId);
  }
  async getAllBookmarks() {
    return await this.supabase.from("bookmarks").select("*");
  }

  // AI Summary methods for tender_ai_summaries table
  async getTenderAiSummary(tenderId: string) {
    try {
      const { data, error } = await this.supabase
        .from("tender_ai_summaries")
        .select("summary")
        .eq("id", tenderId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows found
        console.error("Error fetching tender AI summary:", error);
        throw error;
      }

      return data?.summary || null;
    } catch (error) {
      console.error("Failed to fetch tender AI summary:", error);
      return null;
    }
  }

  async saveTenderAiSummary(tenderId: string, summary: any) {
    try {
      const { data, error } = await this.supabase
        .from("tender_ai_summaries")
        .upsert({
          id: tenderId,
          summary: summary,
        })
        .select();

      if (error) {
        console.error("Error saving tender AI summary:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to save tender AI summary:", error);
      throw error;
    }
  }

  async resetTenderLastRefreshDate() {
    return await this.supabase.from("metadata").upsert({
      key: "tenders_last_refresh",
      value: String(new Date().getTime()),
    });
  }

  async getLastRefreshDate() {
    return await this.supabase
      .from("metadata")
      .select("value")
      .eq("key", "tenders_last_refresh")
      .single();
  }

  async getRefreshInProgress() {
    return await this.supabase
      .from("metadata")
      .select("value")
      .eq("key", "tenders_refresh_in_progress")
      .single();
  }

  /**
   * Atomically try to acquire the refresh lock using Supabase function
   * @returns {Promise<boolean>} true if lock was acquired, false if already locked
   */
  async tryAcquireRefreshLock() {
    try {
      const { data, error } = await this.supabase.rpc(
        "try_acquire_refresh_lock"
      );

      if (error) {
        console.error("Error acquiring refresh lock:", error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error("Error calling try_acquire_refresh_lock function:", error);
      return false;
    }
  }

  async setRefreshInProgress(inProgress: boolean) {
    return await this.supabase.from("metadata").upsert({
      key: "tenders_refresh_in_progress",
      value: String(inProgress),
    });
  }

  async clearTenders() {
    return await this.supabase.from("tenders").delete().neq("title", "");
  }

  async insertTenders(
    tenderData: Database["public"]["Tables"]["tenders"]["Insert"][]
  ) {
    return await this.supabase.from("tenders").insert(tenderData);
  }

  // New method: Upsert tenders to preserve bookmarks
  async upsertTenders(
    tenderData: Database["public"]["Tables"]["tenders"]["Insert"][]
  ) {
    try {
      // Use id as the unique identifier for upserting
      // This preserves existing tender IDs and thus maintains bookmark relationships
      const { data, error } = await this.supabase
        .from("tenders")
        .upsert(tenderData, {
          onConflict: "id",
          ignoreDuplicates: false,
        })
        .select();

      if (error) {
        console.error("Error upserting tenders:", error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error("Failed to upsert tenders:", error);
      throw error;
    }
  }

  // Method to remove tenders that are no longer in the fresh data
  async removeStaleTemders(currentReferenceNumbers: string[]) {
    try {
      // Delete tenders whose reference numbers are not in the current dataset
      const { data, error } = await this.supabase
        .from("tenders")
        .delete()
        .not(
          "source_reference",
          "in",
          `(${currentReferenceNumbers.join(",")})`
        );

      if (error) {
        console.error("Error removing stale tenders:", error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error("Failed to remove stale tenders:", error);
      throw error;
    }
  }

  async getTenderById(id: string) {
    return await this.supabase
      .from("tenders")
      .select("*")
      .eq("id", id)
      .single();
  }

  async getAllTenders() {
    return await this.supabase.from("tenders").select("*");
  }

  async getTendersForAiFiltering(limit: number = 5) {
    return await this.supabase
      .from("tenders")
      .select("source_reference, description")
      .limit(limit);
  }

  async getTendersByReferenceNumbers(referenceNumbers: string[]) {
    return await this.supabase
      .from("tenders")
      .select("*")
      .in("source_reference", referenceNumbers);
  }

  async insertRfpAnalysis(data: string) {
    // Generate a unique id for the analysis
    const id = Date.now(); // Simple timestamp-based ID
    return await this.supabase.from("rfp_analysis").insert({ id, data });
  }

  async searchTendersByVector(
    queryEmbedding: number[],
    matchThreshold: number = 0.78,
    matchCount: number = 30
  ) {
    return await this.supabase.rpc("match_tenders_by_vector", {
      query_embedding: JSON.stringify(queryEmbedding),
      match_threshold: matchThreshold,
      match_count: matchCount,
    });
  }

  // Authentication methods
  async signUpUser(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Error signing up user:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to sign up user:", error);
      throw error;
    }
  }

  async signInUser(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Error signing in user:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to sign in user:", error);
      throw error;
    }
  }

  async signOutUser() {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        console.error("Error signing out user:", error);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Failed to sign out user:", error);
      throw error;
    }
  }

  async getUser() {
    try {
      const { data, error } = await this.supabase.auth.getUser();
      console.log("data", data);
      if (error) {
        console.error("Error getting session:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to get session:", error);
      throw error;
    }
  }

  async resetPasswordForEmail(email: string, redirectTo?: string) {
    try {
      const { data, error } = await this.supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            redirectTo || `${process.env.FRONTEND_URL}/update-password`,
        }
      );

      if (error) {
        console.error("Error sending password reset email:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      throw error;
    }
  }

  async updateUserPassword(accessToken: string, password: string) {
    try {
      // Set the session with the access token first
      const { data: sessionData, error: sessionError } =
        await this.supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: "", // Will be handled by Supabase
        });

      if (sessionError) {
        console.error(
          "Error setting session for password update:",
          sessionError
        );
        throw sessionError;
      }

      // Update the password
      const { data, error } = await this.supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error("Error updating password:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to update password:", error);
      throw error;
    }
  }

  // Profile methods
  async createOrUpdateProfile(
    profileData:
      | Database["public"]["Tables"]["profiles"]["Insert"]
      | Database["public"]["Tables"]["profiles"]["Update"]
  ) {
    try {
      const { data, error } = await this.supabase
        .from("profiles")
        .upsert(profileData)
        .select();

      if (error) {
        console.error("Error creating/updating profile:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to create/update profile:", error);
      throw error;
    }
  }

  async getProfile(
    userId: string
  ): Promise<Database["public"]["Tables"]["profiles"]["Row"] | null> {
    try {
      const { data, error } = await this.supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows found
        console.error("Error fetching profile:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      return null;
    }
  }

  // Bookmark methods
  async createBookmark(userId: string, tenderNoticeId: string, notes?: string) {
    try {
      const bookmarkData: Database["public"]["Tables"]["bookmarks"]["Insert"] =
        {
          user_id: userId,
          tender_notice_id: tenderNoticeId,
          notes: notes || null,
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

      const { data, error } = await this.supabase
        .from("bookmarks")
        .upsert(bookmarkData, {
          onConflict: "user_id,tender_notice_id",
        })
        .select();

      if (error) {
        console.error("Error creating bookmark:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to create bookmark:", error);
      throw error;
    }
  }

  async removeBookmark(userId: string, tenderNoticeId: string) {
    try {
      const { data, error } = await this.supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("tender_notice_id", tenderNoticeId)
        .select();

      if (error) {
        console.error("Error removing bookmark:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      throw error;
    }
  }

  async getUserBookmarks(
    userId: string
  ): Promise<Database["public"]["Tables"]["bookmarks"]["Row"][]> {
    try {
      const { data, error } = await this.supabase
        .from("bookmarks")
        .select(
          `
          *,
          tender_notice:tenders(*)
        `
        )
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching user bookmarks:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Failed to fetch user bookmarks:", error);
      return [];
    }
  }

  async updateBookmarkNotes(
    userId: string,
    tenderNoticeId: string,
    notes: string
  ) {
    try {
      const { data, error } = await this.supabase
        .from("bookmarks")
        .update({
          notes,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("tender_notice_id", tenderNoticeId)
        .select();

      if (error) {
        console.error("Error updating bookmark notes:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to update bookmark notes:", error);
      throw error;
    }
  }

  async isBookmarked(userId: string, tenderNoticeId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", userId)
        .eq("tender_notice_id", tenderNoticeId)
        .eq("status", "active")
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows found
        console.error("Error checking bookmark status:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Failed to check bookmark status:", error);
      return false;
    }
  }

  // Subscription methods
  async createSubscription(
    subscriptionData: Database["public"]["Tables"]["subscriptions"]["Insert"]
  ) {
    try {
      const { data, error } = await this.supabase
        .from("subscriptions")
        .upsert(subscriptionData, {
          onConflict: "user_id",
        })
        .select();

      if (error) {
        console.error("Error creating subscription:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to create subscription:", error);
      throw error;
    }
  }

  async getSubscriptionByUserId(
    userId: string
  ): Promise<Database["public"]["Tables"]["subscriptions"]["Row"] | null> {
    try {
      const { data, error } = await this.supabase
        .from("subscriptions")
        .select(
          `
          *,
          plan:plans(*)
        `
        )
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows found
        console.error("Error fetching subscription:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
      return null;
    }
  }

  async updateSubscriptionByStripeId(
    stripeSubscriptionId: string,
    updateData: Database["public"]["Tables"]["subscriptions"]["Update"]
  ) {
    try {
      const { data, error } = await this.supabase
        .from("subscriptions")
        .update(updateData)
        .eq("stripe_subscription_id", stripeSubscriptionId)
        .select();

      if (error) {
        console.error("Error updating subscription:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to update subscription:", error);
      throw error;
    }
  }

  async getSubscriptionByStripeId(
    stripeSubscriptionId: string
  ): Promise<Database["public"]["Tables"]["subscriptions"]["Row"] | null> {
    try {
      const { data, error } = await this.supabase
        .from("subscriptions")
        .select("*")
        .eq("stripe_subscription_id", stripeSubscriptionId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching subscription by Stripe ID:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to fetch subscription by Stripe ID:", error);
      return null;
    }
  }

  // Plan methods
  async getPlan(
    planId: string
  ): Promise<Database["public"]["Tables"]["plans"]["Row"] | null> {
    try {
      const { data, error } = await this.supabase
        .from("plans")
        .select("*")
        .eq("id", planId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching plan:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to fetch plan:", error);
      return null;
    }
  }

  async getAllPlans(): Promise<Database["public"]["Tables"]["plans"]["Row"][]> {
    try {
      const { data, error } = await this.supabase
        .from("plans")
        .select("*")
        .order("price_monthly", { ascending: true });

      if (error) {
        console.error("Error fetching plans:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      return [];
    }
  }

  async createPlan(planData: Database["public"]["Tables"]["plans"]["Insert"]) {
    try {
      const { data, error } = await this.supabase
        .from("plans")
        .insert(planData)
        .select();

      if (error) {
        console.error("Error creating plan:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to create plan:", error);
      throw error;
    }
  }

  async updatePlan(
    planId: string,
    updateData: Database["public"]["Tables"]["plans"]["Update"]
  ) {
    try {
      const { data, error } = await this.supabase
        .from("plans")
        .update(updateData)
        .eq("id", planId)
        .select();

      if (error) {
        console.error("Error updating plan:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to update plan:", error);
      throw error;
    }
  }
}
