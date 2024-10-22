"use client";

import { useState, useEffect, useCallback } from "react";
import { account } from "@/lib/appwrite";
import { AppwriteException } from "appwrite";
import { User } from "@/models/User";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

interface UseCurrentUserReturn {
  user?: User;
  loading: boolean;
  error: AppwriteException | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const useCurrentUser = (): UseCurrentUserReturn => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AppwriteException | null>(null);

  // Fetch the current user
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser: User = await account.get();
      setUser(currentUser);
    } catch (err) {
      const appwriteError = err as AppwriteException;
      if (appwriteError.code === 401) {
        // Unauthorized, user is not logged in
        setUser(undefined);
      } else {
        setError(appwriteError);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Handle login
  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        await account.createSession(email, password);
        await fetchUser(); // Refresh user data after login
      } catch (err) {
        const appwriteError = err as AppwriteException;
        setError(appwriteError);
      } finally {
        setLoading(false);
      }
    },
    [fetchUser]
  );

  // Handle logout
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await account.deleteSession("current");
      setUser(undefined);
      router.push("/");
    } catch (err) {
      const appwriteError = err as AppwriteException;
      setError(appwriteError);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, login, logout };
};

export default useCurrentUser;
