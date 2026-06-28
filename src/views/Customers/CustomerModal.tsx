import type { JSX } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
}

const CustomerModal = ({
  isOpen,
  onClose,
  isEdit,
}: CustomerModalProps): JSX.Element => {
  const { t } = useTranslation();

  const handleClose = () => {
    // reset();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? t("customers.editCustomer")
                : t("customers.addCustomer")}
            </DialogTitle>
          </DialogHeader>

          <form>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>
                  {t("customers.customerDescriptionModal")}
                </FieldLegend>

                <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="name">
                      <span>{t("common.name")}</span>
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input id="name" />
                    {/* <FieldError>Choose another username.</FieldError> */}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">
                      <span>Email</span>
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input id="email" />
                    {/* <FieldError>Choose another username.</FieldError> */}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="phone">
                      <span>{t("customers.phone")}</span>
                    </FieldLabel>
                    <Input id="phone" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="identification">
                      <span>{t("customers.identification")}</span>
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input id="identification" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="address">
                      <span>{t("customers.address")}</span>
                    </FieldLabel>
                    <Input id="address" />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>

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
