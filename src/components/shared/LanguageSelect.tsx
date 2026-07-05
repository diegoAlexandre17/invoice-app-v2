import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type JSX } from "react";

const LanguageSwitcher = (): JSX.Element => {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", name: "English", flag: "EN" },
    { code: "es", name: "Español", flag: "ES" },
  ];

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-full bg-foreground text-white">
        <SelectValue>
          {languages.find((lang) => lang.code === i18n.language)?.flag}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-foreground text-white" position="popper">
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2 ">
              <span>{lang.flag}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
