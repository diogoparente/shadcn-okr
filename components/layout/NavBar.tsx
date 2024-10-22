"use client";

import React from "react";
import useCurrentUser from "@/hooks/auth/use-current-user";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NavBar: React.FC = () => {
  const { user, loading, logout } = useCurrentUser();

  return (
    <nav key={JSON.stringify(user)} className="container mx-auto p-4">
      <ul className="flex justify-between">
        <li>
          <Link href="/">Home</Link>
        </li>
        {loading ? (
          <li>Loading...</li>
        ) : user ? (
          <Button onClick={logout}>Logout</Button>
        ) : (
          <li className="space-x-4">
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Register</Link>
            </Button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
