// src/components/Navbar/Navbar.tsx
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { User, Notification } from "@/types/types";
import { useUserContext } from "@/auth/contexts/useUserContext";
import { useCognitoSession } from "@/auth/hooks/useCognitoSession";
import NotificationsDropdown from "@/components/Navbar/NotificationsDropdown";
import UserModal from "@/components/Navbar/UserModal";
import { updateUserData } from "@/services/apiService";

interface NavbarProps {
  sharedListUser?: User;
}

export default function Navbar({ sharedListUser }: NavbarProps) {
  const { user, setUser } = useUserContext();
  const { signOut } = useCognitoSession();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const markAllAsRead = () => {
    if (user && user.notifications) {
      const updatedNotifications = user.notifications.map((n: Notification) => ({
        ...n,
        read: true,
      }));
      setUser({ ...user, notifications: updatedNotifications });
    }
  };

  const handleLogout = async () => {
    if (user) {
      try {
        // Aseguramos que lists, sharedLists y notifications sean arrays (si son undefined, se les asigna [])
        await updateUserData({
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          lists: user.lists || [],
          sharedLists: user.sharedLists || [],
          notifications: user.notifications || [],
        });
      } catch (error) {
        console.error(
          "Error actualizando los datos del usuario antes de cerrar sesión",
          error
        );
      }
    }
    signOut();
    setIsUserModalOpen(false);
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="bg-[#0B5CD6] text-white h-16 px-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold cursor-pointer" onClick={() => navigate("/")}>
        Taskify
      </h1>

      <div className="flex items-center gap-5">
        {user ? (
          <>
            <NotificationsDropdown
              notifications={user.notifications || []}
              markAllAsRead={markAllAsRead}
            />

            {sharedListUser && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={sharedListUser.avatarUrl} alt={sharedListUser.name} />
                <AvatarFallback>{sharedListUser.name[1]}</AvatarFallback>
              </Avatar>
            )}

            <div onClick={() => setIsUserModalOpen(true)} className="cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name ? user.name[0] : "?"}</AvatarFallback>
              </Avatar>
            </div>
            <UserModal
              open={isUserModalOpen}
              onOpenChange={setIsUserModalOpen}
              user={user}
              handleLogout={handleLogout}
              isDarkMode={isDarkMode}
              onDarkModeChange={setIsDarkMode}
            />
          </>
        ) : (
          !user &&
          location.pathname !== "/login" &&
          location.pathname !== "/register" && (
            <Button
              variant="primary"
              onClick={handleLogin}
              className="text-white hover:bg-white/20"
            >
              Iniciar sesión
            </Button>
          )
        )}
      </div>
    </header>
  );
}
