import { SidebarTrigger } from "@/components/ui/sidebar";
import UserDropDown from "./UserDropDown";
import Breadcrumbs from "./Breadcrumbs";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-2 border-b h-16">
      <div className="flex items-center gap-x-2">
        <SidebarTrigger />
        <Breadcrumbs />
      </div>
      <div className="flex gap-x-2 items-center ml-auto">
        <p>Toogle theme</p>
        <UserDropDown />
      </div>
    </div>
  );
};

export default Navbar;
