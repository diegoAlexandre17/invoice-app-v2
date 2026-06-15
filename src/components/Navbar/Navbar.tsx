import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Navbar = () => {
  return (
    <div className="flex items-center px-2 gap-x-4 lg:px-6 justify-content-between w-full bg-background border-b h-15">
      <div className="block lg:hidden">
        <Sheet>
          <SheetTrigger className="flex items-center">
            <Menu />
          </SheetTrigger>
          <SheetContent side="left">
            <p>This is the sheet content.</p>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-x-2 items-center ml-auto">
        <p>Toogle theme</p>
        <Avatar>
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="@shadcn"
            className="grayscale"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Navbar;
