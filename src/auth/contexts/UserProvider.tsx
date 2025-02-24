import { useState, useMemo, useEffect, ReactNode } from "react";
import { UserContext } from "./UserContext";
import type { User } from "@/types/types";

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error al parsear el usuario desde localStorage:", error);
      return null;
    }
  });

  // Actualiza el localStorage cada vez que el usuario cambia
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error al guardar el usuario en localStorage:", error);
    }
  }, [user]);

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
