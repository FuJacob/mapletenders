import { useState, useEffect } from "react";
import { getUserSubscription, type Subscription } from "../api/subscriptions";
import { useAuth } from "./auth";

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.id) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const subscriptionData = await getUserSubscription(user.id);
        setSubscription(subscriptionData);
      } catch (err) {
        console.error("Error fetching subscription:", err);
        setError("Failed to load subscription data");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user?.id]);

  return {
    subscription,
    loading,
    error,
  };
}
