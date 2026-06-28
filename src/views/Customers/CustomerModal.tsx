import type { JSX } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomerModal = ({
  isOpen,
  onClose,
}: CustomerModalProps): JSX.Element => {

    const {t} = useTranslation()

  const handleClose = () => {
    // reset();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </DialogHeader>

          <div>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero
              debitis quam amet atque maxime cupiditate veritatis ex repudiandae
              nobis harum illo enim recusandae, distinctio architecto tenetur.
              Molestias itaque distinctio omnis?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero
              debitis quam amet atque maxime cupiditate veritatis ex repudiandae
              nobis harum illo enim recusandae, distinctio architecto tenetur.
              Molestias itaque distinctio omnis?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero
              debitis quam amet atque maxime cupiditate veritatis ex repudiandae
              nobis harum illo enim recusandae, distinctio architecto tenetur.
              Molestias itaque distinctio omnis?
            </p>

            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero
              debitis quam amet atque maxime cupiditate veritatis ex repudiandae
              nobis harum illo enim recusandae, distinctio architecto tenetur.
              Molestias itaque distinctio omnis?
            </p>
          </div>
          <DialogFooter>
            
              <Button variant={"destructive"}>{t("common.cancel")}</Button>
              <Button variant={"success"}>{t("common.save")}</Button>
            
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerModal;
