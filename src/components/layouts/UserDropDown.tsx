import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const UserDropDown = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18next.changeLanguage(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar size="lg">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="@shadcn"
            className="grayscale"
          />
          <AvatarFallback>CN</AvatarFallback>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDown;
