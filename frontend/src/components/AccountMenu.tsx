import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { fetchUsers } from "@/api/user";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface User {
  firstName: string;
  lastName: string;
  imageUrl: string;
}

const AccountMenu = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const users = await fetchUsers();
        if (users && users.length > 0) {
          setUser(users[0]);
        } else {
          console.error("No users found.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-background rounded-md border-0 outline-none">
        <Avatar className="w-9 h-9">
          <AvatarImage
            src={user?.imageUrl || ""}
            alt={user ? `${user.firstName} ${user.lastName}` : "User avatar"}
          />
          <AvatarFallback>{user?.firstName?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-1">
          <span className="text-background-text font-medium text-sm">
            {user?.firstName} {user?.lastName}
          </span>
          <ChevronDown className="text-background-text w-4 h-4" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60" align="start">
        <DropdownMenuLabel>Account</DropdownMenuLabel>

        <div className="flex flex-col items-center gap-2 px-3 py-3">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={user?.imageUrl || ""}
              alt={user ? `${user.firstName} ${user.lastName}` : "User avatar"}
            />
            <AvatarFallback>{user?.firstName?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="m-0 font-bold text-subtext text-sm">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate("/settings")}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountMenu;
