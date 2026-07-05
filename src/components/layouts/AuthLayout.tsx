import { Outlet } from "react-router";
import LanguageSwitcher from "../shared/LanguageSelect";

const AuthLayout = () => {
  return (
    <>
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <Outlet />
    </>
  );
};

export default AuthLayout;
