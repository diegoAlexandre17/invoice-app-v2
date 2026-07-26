import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Customer } from "@/features/customers/domain/entities/Customer";
import { useCreateCustomer } from "@/features/customers/presentation/hooks/useCreateCustomer";
import { useEditCustomer } from "@/features/customers/presentation/hooks/useEditCustomer";
import en from "@/i18n/locales/en.json";
import type { ParseKeys } from "i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, type JSX } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const customerSchema = z.object({
  name: z.string().min(1, "nameRequired").max(60, "maxLength60"),
  email: z.email("emailRequired"),
  phone: z.string().max(15, "maxLength15").optional(),
  identification: z.string().max(15, "maxLength15").optional(),
  address: z.string().max(60, "maxLength60").optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;
type ErrorFormKey = keyof typeof en.errorsForm.customers;

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditData: Customer | null;
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
  isEditData,
}: CustomerModalProps): JSX.Element => {
  const { t } = useTranslation();

  const createCustomer = useCreateCustomer();
  const editCustomer = useEditCustomer();
  const queryClient = useQueryClient();

  const isSubmitting = createCustomer.isPending || editCustomer.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isEditData !== null) {
      reset({
        name: isEditData?.name,
        email: isEditData?.email,
        phone: isEditData?.phone || "",
        identification: isEditData?.identification || "",
        address: isEditData?.address || "",
      });
    }
  }, [isEditData, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const handleSuccess = () => {
    handleClose();
    queryClient.invalidateQueries({ queryKey: ["customers"] });
  };

  const onSubmit: SubmitHandler<CustomerFormData> = (formData) => {
    const dataToSend = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      identification: formData.identification || undefined,
      address: formData.address || undefined,
    };

    if (isEditData) {
      return editCustomer.mutate(
        { ...dataToSend, id: isEditData.id },
        {
          onSuccess: () => {
            handleSuccess();
            toast.success(t("common.success"), {
              description: t("customers.updateCustomerSuccess"),
            });
          },
          onError: (error) => {
            toast.error(t("common.warning"), {
              description: t(error.message as ParseKeys),
            });
          },
        },
      );
    }

    createCustomer.mutate(dataToSend, {
      onSuccess: () => {
        handleSuccess();
        toast.success(t("common.success"), {
          description: t("customers.createCustomerSuccess"),
        });
      },
      onError: (error) => {
        toast.error(t("common.warning"), {
          description: t(error.message as ParseKeys),
        });
      },
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditData
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
                      {t(
                        `errorsForm.customers.${errors.name.message as ErrorFormKey}`,
                      )}
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
                      {t(
                        `errorsForm.customers.${errors.email.message as ErrorFormKey}`,
                      )}
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
            <Button
              variant={"destructive"}
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant={"success"}
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerModal;
