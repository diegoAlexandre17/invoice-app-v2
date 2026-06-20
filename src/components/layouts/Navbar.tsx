import { SidebarTrigger } from "@/components/ui/sidebar";
import UserDropDown from "./UserDropDown";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-2 border-b bg-white h-16">
      <SidebarTrigger />
      <div className="flex gap-x-2 items-center ml-auto">
        <p>Toogle theme</p>
        <UserDropDown />
      </div>
    </div>
  );
};

export default Navbar;
