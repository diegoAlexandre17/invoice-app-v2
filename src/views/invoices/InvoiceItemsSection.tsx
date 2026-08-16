import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getCurrencySymbol } from "@/features/company/domain/currencySymbol";
import { useGetCompanyData } from "@/features/company/presentation/useGetCompanyData";
import {
  calculateInvoiceTotal,
  calculateItemTotal,
} from "@/features/invoices/domain/entities/Invoice";
import type { InvoiceFormData } from "@/views/invoices/InvoiceForm";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ParseKeys } from "i18next";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import type {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

const invoiceItemSchema = z.object({
  description: z
    .string()
    .min(1, "errorsForm.invoices.descriptionRequired")
    .max(120, "errorsForm.common.maxLength120"),
  // El { message } cubre el caso "no es un number válido" (incl. NaN, que es lo
  // que produce valueAsNumber cuando el user tipea "1-", "+", o deja vacío).
  // Sin esto, zod tira su mensaje CRUDO en inglés ("expected number, received
  // NaN") en vez de la clave i18n.
  quantity: z
    .number({ message: "errorsForm.invoices.quantityRequired" })
    .int("errorsForm.invoices.quantityInteger")
    .min(1, "errorsForm.invoices.quantityRequired"),
  unitPrice: z
    .number({ message: "errorsForm.invoices.priceRequired" })
    .min(0, "errorsForm.invoices.priceRequired"),
});

type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>;
type ErrorFormKey = ParseKeys;

const FieldMessageSlot = ({ children }: { children?: React.ReactNode }) => (
  <div className="min-h-5">{children}</div>
);

interface InvoiceItemsSectionProps {
  fields: FieldArrayWithId<InvoiceFormData, "items", "id">[];
  append: UseFieldArrayAppend<InvoiceFormData, "items">;
  remove: UseFieldArrayRemove;
}

const InvoiceItemsSection = ({
  fields,
  append,
  remove,
}: InvoiceItemsSectionProps) => {
  const { t } = useTranslation();
  const { data: company } = useGetCompanyData();
  const currencySymbol = getCurrencySymbol(company?.currency);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvoiceItemFormData>({
    resolver: zodResolver(invoiceItemSchema),
    defaultValues: { description: "", quantity: 1, unitPrice: 0 },
  });

  const onAddItem = (data: InvoiceItemFormData) => {
    append({
      description: data.description,
      // categoryName: se sumará cuando integremos el combobox de categorías.
      categoryName: "",
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      total: calculateItemTotal(data.quantity, data.unitPrice),
    });
    reset();
  };

  const invoiceTotal = calculateInvoiceTotal(fields);

  return (
    <Card className="shadow-none ring-0">
      <CardHeader>
        <CardTitle className="text-xl">{t("invoices.items")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <form onSubmit={handleSubmit(onAddItem)}>
          <FieldGroup className="grid grid-cols-1 gap-0 md:gap-4 md:grid-cols-[1fr_auto_auto_auto]">
            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="item-description">
                <span>{t("invoices.description")}</span>
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="item-description"
                placeholder={t("invoices.descriptionPlaceholder")}
                aria-invalid={!!errors.description}
                {...register("description")}
              />
              <FieldMessageSlot>
                {errors.description && (
                  <FieldError>
                    {t(errors.description.message as ErrorFormKey)}
                  </FieldError>
                )}
              </FieldMessageSlot>
            </Field>

            <Field data-invalid={!!errors.quantity}>
              <FieldLabel htmlFor="item-quantity">
                <span>{t("invoices.quantity")}</span>
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="item-quantity"
                type="number"
                min={1}
                step={1}
                aria-invalid={!!errors.quantity}
                {...register("quantity", { valueAsNumber: true })}
              />
              <FieldMessageSlot>
                {errors.quantity && (
                  <FieldError>
                    {t(errors.quantity.message as ErrorFormKey)}
                  </FieldError>
                )}
              </FieldMessageSlot>
            </Field>

            <Field data-invalid={!!errors.unitPrice}>
              <FieldLabel htmlFor="item-unitPrice">
                <span>{t("invoices.unitPrice")}</span>
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="item-unitPrice"
                type="number"
                min={0}
                step="0.01"
                aria-invalid={!!errors.unitPrice}
                {...register("unitPrice", { valueAsNumber: true })}
              />
              <FieldMessageSlot>
                {errors.unitPrice && (
                  <FieldError>
                    {t(errors.unitPrice.message as ErrorFormKey)}
                  </FieldError>
                )}
              </FieldMessageSlot>
            </Field>

            <div className="my-auto">
              <Button type="submit">
                <Plus />
                {t("invoices.addItem")}
              </Button>
            </div>
          </FieldGroup>
        </form>

        {fields.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            {t("invoices.noItemsYet")}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <Card key={field.id} size="sm">
                <CardContent className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <span className="font-medium text-primary">
                      {t("invoices.itemNumber", { number: index + 1 })}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                    <div>
                      <p className="text-muted-foreground">
                        {t("invoices.description")}
                      </p>
                      <p>{field.description}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {t("invoices.quantity")}
                      </p>
                      <p>{field.quantity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {t("invoices.unitPrice")}
                      </p>
                      <p>
                        {currencySymbol}
                        {field.unitPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-sm">
                    <span className="text-muted-foreground">
                      {t("invoices.itemTotal")}{" "}
                    </span>
                    <span className="font-semibold text-success">
                      {currencySymbol}
                      {calculateItemTotal(
                        field.quantity,
                        field.unitPrice,
                      ).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Total general de la factura, derivado en vivo. */}
            <div className="flex justify-end border-t pt-3 text-base">
              <span className="text-muted-foreground">
                {t("common.total")}:
              </span>
              <span className="ml-2 font-bold text-success">
                {currencySymbol}
                {invoiceTotal.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceItemsSection;
