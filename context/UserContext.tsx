"use client";
import React, { createContext, useContext, ReactNode, useState } from "react";
import { AppwriteException } from "appwrite";
import { User } from "@/models/User";

interface UserContextProps {
  user?: User;
  setUser: (user?: User) => void;
}

const UserContext = createContext<UserContextProps>({
  user: undefined,
  setUser: (user?: User) => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>();
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = (): UserContextProps => {
  return useContext(UserContext);
};
