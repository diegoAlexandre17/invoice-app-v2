import { useEffect, type JSX } from "react";
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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import en from "@/i18n/locales/en.json";
import type { ICustomers } from "./types";

const customerSchema = z.object({
  name: z.string().min(1, "nameRequired").max(60, "maxLength60"),
  email: z.email("emailRequired"),
  phone: z.string().max(15, "maxLength15").optional(),
  identification: z.string().max(15, "maxLength15").optional(),
  address: z.string().max(60, "maxLength60").optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;
type ErrorFormKey = keyof typeof en.errorsForm;

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: ICustomers | null;
}

const defaultValues = {
  name: "",
  email: "",
  phone: "",
  identification: "",
  address: "",
};

const CustomerModal = ({
  isOpen,
  onClose,
  isEdit,
}: CustomerModalProps): JSX.Element => {
  console.log(isEdit);
  const { t } = useTranslation();

  useEffect(() => {
    if (isEdit !== null) {
      reset({
        name: isEdit?.name,
        email: isEdit?.email,
        phone: isEdit?.phone || "",
        identification: isEdit?.identification || "",
        address: isEdit?.address || "",
      });
    }
  }, [isEdit]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const onSubmit: SubmitHandler<CustomerFormData> = (formData) => {
    console.log(formData);
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
                  <Input id="name" {...register("name")} />
                  {errors.name && (
                    <FieldError>
                      {t(`errorsForm.${errors.name.message as ErrorFormKey}`)}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">
                    <span>Email</span>
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="email" {...register("email")} />
                  {errors.email && (
                    <FieldError>
                      {t(`errorsForm.${errors.email.message as ErrorFormKey}`)}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">
                    <span>{t("customers.phone")}</span>
                  </FieldLabel>
                  <Input id="phone" {...register("phone")} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="identification">
                    <span>{t("customers.identification")}</span>
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="identification" {...register("identification")} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="address">
                    <span>{t("customers.address")}</span>
                  </FieldLabel>
                  <Input id="address" {...register("address")} />
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>

          <DialogFooter>
            <Button variant={"destructive"} onClick={handleClose}>
              {t("common.cancel")}
            </Button>
            <Button variant={"success"} onClick={handleSubmit(onSubmit)}>
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerModal;
