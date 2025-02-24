// src/auth/hooks/useCognitoSession.ts
import { useEffect } from "react";
import { getCurrentUser, signOutUser } from "@/auth/services/cognitoService";
import { useUserContext } from "@/auth/contexts/useUserContext";

export function useCognitoSession() {
  const { setUser } = useUserContext();

  useEffect(() => {
    const cognitoUser = getCurrentUser();
    if (cognitoUser) {
      cognitoUser.getSession((err: any) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
  }, [setUser]);

  const signOut = () => {
    signOutUser();
    setUser(null);
  };

  return { signOut };
}


