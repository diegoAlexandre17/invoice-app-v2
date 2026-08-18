import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCurrencySymbol } from "@/features/company/domain/currencySymbol";
import { useGetCompanyData } from "@/features/company/presentation/useGetCompanyData";
import InvoiceItemsSection from "@/views/invoices/InvoiceItemsSection";
import InvoicePDFPreview from "@/views/invoices/InvoicePDFPreview";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ParseKeys } from "i18next";
import { useState } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";


const invoiceItemSchema = z.object({
  description: z.string().min(1).max(120),
  categoryName: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  total: z.number(),
});

const invoiceSchema = z.object({
  name: z
    .string()
    .min(1, "errorsForm.common.nameRequired")
    .max(60, "errorsForm.common.maxLength60"),
  email: z.email("errorsForm.common.emailRequired"),
  address: z.string().max(120, "errorsForm.common.maxLength120").optional(),
  identification: z
    .string()
    .min(1, "errorsForm.customers.identificationRequired")
    .max(15, "errorsForm.common.maxLength15"),
  phone: z.string().max(15, "errorsForm.common.maxLength15").optional(),
  notes: z.string().max(500, "errorsForm.common.maxLength500").optional(),
  // "Al menos un ítem" para emitir. Valida la LISTA, no los inputs de carga.
  items: z.array(invoiceItemSchema).min(1, "errorsForm.invoices.itemsRequired"),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
type ErrorFormKey = ParseKeys;

const InvoiceForm = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { t } = useTranslation();

  const { data: company, isPending: isCompanyDataPending } =
    useGetCompanyData();
  const currencySymbol = getCurrencySymbol(company?.currency);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: { items: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit: SubmitHandler<InvoiceFormData> = (formData) => {
    console.log(formData);
    setPreviewOpen(true);
  };

  if (isCompanyDataPending) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {t("customers.clientDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <FieldGroup className="grid grid-cols-1 md:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="name">
                <span>{t("customers.customerName")}</span>
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <FieldError>
                  {t(errors.name.message as ErrorFormKey)}
                </FieldError>
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
              </FieldLabel>
              <Input id="phone" {...register("phone")} />
              {errors.phone && (
                <FieldError>
                  {t(errors.phone.message as ErrorFormKey)}
                </FieldError>
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
              <Textarea
                id="notes"
                placeholder="Type your message here."
                {...register("notes")}
              />
              {errors.notes && (
                <FieldError>
                  {t(errors.notes.message as ErrorFormKey)}
                </FieldError>
              )}
            </Field>
          </FieldGroup>
        </CardContent>
        <div>
          <InvoiceItemsSection
            fields={fields}
            append={append}
            remove={remove}
            currencySymbol={currencySymbol}
          />
          {errors.items && (
            <FieldError className="text-center">
              {t(errors.items.message as ErrorFormKey)}
            </FieldError>
          )}
        </div>
        <CardFooter className="gap-2 justify-end">
          <Button
            variant={"destructive"}
            type="button"
            /* disabled={
              editCompanyDataMutation.isPending || uploadLogoMutation.isPending
            } */
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant={"success"}
            type="button"
            onClick={handleSubmit(onSubmit)}
            /* disabled={
              editCompanyDataMutation.isPending || uploadLogoMutation.isPending
            } */
          >
            {t("common.preview")}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] grid-rows-[auto_1fr_auto]">
          <DialogHeader>
            <DialogTitle className="pr-8">
              {t("invoices.invoicePreview")}
            </DialogTitle>
          </DialogHeader>

          <div className=" overflow-auto">
            {company && <InvoicePDFPreview company={company} />}
          </div>

          <DialogFooter>
            <Button
              variant={"destructive"}
              // disabled={isSubmitting}
              type="button"
              onClick={() => setPreviewOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              variant={"success"}
              // onClick={handleSubmit(onSubmit)}
              // disabled={isSubmitting}
            >
              {t("invoices.createInvoice")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceForm;
