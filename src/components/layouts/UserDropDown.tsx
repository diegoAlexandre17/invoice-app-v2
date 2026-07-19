import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { LogOutIcon } from "lucide-react";
import { useLogout } from "@/features/auth/presentation/hooks/useLogout";
import { useNavigate } from "react-router";
import { PATHS } from "@/router/paths";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "@/features/auth/presentation/hooks/useSession";

const UserDropDown = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const logout = useLogout();
  const queryClient = useQueryClient();

  const { data: user } = useSession();

  const handleLanguageChange = (value: string) => {
    i18next.changeLanguage(value);
  };

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        navigate(PATHS.login);
      },
      onError: () => {
        toast.error("Error", {
          description: t("common.commonError"),
        });
      },
    });
  };

  return (
    <DropdownMenu>
      <div className="flex flex-col items-center">
        <p>{user?.name}</p>
        <small>{user?.email}</small>
      </div>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar size="lg">
          <AvatarFallback>
            {user?.name?.charAt(0).toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("common.language")}</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={i18n.language === "es"}
            onCheckedChange={() => handleLanguageChange("es")}
          >
            {t("common.spanish")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={i18n.language === "en"}
            onCheckedChange={() => handleLanguageChange("en")}
          >
            {t("common.english")}
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOutIcon />
            {t("common.logout")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDown;
