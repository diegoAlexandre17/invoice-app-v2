import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ParseKeys } from "i18next";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

const invoiceSchema = z.object({
  name: z
    .string()
    .min(1, "errorsForm.common.nameRequired")
    .max(60, "errorsForm.commonmaxLength60"),
  email: z.email("errorsForm.common.emailRequired"),
  address: z
    .string()
    .min(1, "errorsForm.customers.addressRequired")
    .max(120, "errorsForm.common.maxLength120"),
  identification: z
    .string()
    .min(1, "errorsForm.customers.identificationRequired")
    .max(15, "maxLength60"),
  phone: z
    .string()
    .min(1, "errorsForm.customers.phoneRequired")
    .max(15, "maxLength15"),
  notes: z.string().max(500, "errorsForm.common.maxLength500").optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;
type ErrorFormKey = ParseKeys;

const InvoiceForm = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    // defaultValues,
  });

  return (
    <Card>
      <CardContent>
        <FieldGroup className="grid grid-cols-1 md:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="name">
              <span>{t("customers.customerName")}</span>
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <FieldError>{t(errors.name.message as ErrorFormKey)}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="identification">
              <span>{t("company.identification")}</span>
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Input id="identification" {...register("identification")} />
            {errors.identification && (
              <FieldError>
                {t(errors.identification.message as ErrorFormKey)}
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
                {errors.email && (
                  <FieldError>
                    {t(errors.email.message as ErrorFormKey)}
                  </FieldError>
                )}
              </FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">
              <span>{t("customers.phone")}</span>
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Input id="phone" {...register("phone")} />
            {errors.phone && (
              <FieldError>{t(errors.phone.message as ErrorFormKey)}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="address">
              <span>{t("customers.address")}</span>
            </FieldLabel>
            <Input id="address" {...register("address")} />
            {errors.address && (
              <FieldError>
                {t(errors.address.message as ErrorFormKey)}
              </FieldError>
            )}
          </Field>

          <Field className="md:col-span-2">
            <FieldLabel htmlFor="notes">
              <span>{t("invoices.notes")}</span>
            </FieldLabel>
            <Textarea id="notes" placeholder="Type your message here." />
            {errors.notes && (
              <FieldError>{t(errors.notes.message as ErrorFormKey)}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
