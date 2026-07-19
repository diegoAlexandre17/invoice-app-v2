import Swal from "sweetalert2";
import type { SweetAlertResult } from "sweetalert2";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const types = ["error", "warning", "info", "success", "question"] as const;
type SweetAlertType = (typeof types)[number];

type Options = {
  customClass?: Record<string, string>;
  [key: string]: any;
};

const SweetModal = (
  type: SweetAlertType,
  title: string,
  message: string,
  buttonText: string,
  actionAfter = (_result?: SweetAlertResult) => {},
  options: Options = {},
  closeButton: boolean = false
) => {
  if (!types.includes(type))
    return console.warn(`SweetModal: type must be one of ${types.join(", ")}`);

  const defaultCustomClass = {
    // container: "px-5",
    confirmButton: buttonVariants({ variant: "success" }),
    cancelButton: cn(buttonVariants({ variant: "destructive" }), "mx-3"),
  };

  return Swal.fire({
    title,
    text: message,
    icon: type,
    confirmButtonText: buttonText,
    showCloseButton: closeButton,
    customClass: options.customClass ?? defaultCustomClass,
    buttonsStyling: false,
    reverseButtons: true,
    ...options,
  }).then((result) => actionAfter(result));
};

export default SweetModal;
