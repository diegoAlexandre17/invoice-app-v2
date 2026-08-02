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
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCompanyData } from "@/features/company/presentation/useGetCompanyData";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ParseKeys } from "i18next";
import { CloudUpload, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";

const MAX_SIZE = 2 * 1024 * 1024;

const companySchema = z.object({
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
  currency: z.enum(["USD", "EUR"]),
  logo: z.union([z.union([z.string(), z.instanceof(FileList), z.undefined()])]),
});

type CompanyFormData = z.infer<typeof companySchema>;
type ErrorFormKey = ParseKeys;

const defaultValues: CompanyFormData = {
  name: "",
  email: "",
  address: "",
  identification: "",
  phone: "",
  currency: "USD",
  logo: undefined,
};

const CompanyData = () => {
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const { t } = useTranslation();

  const { data: companyData, isPending: isCompanyDataPending } =
    useGetCompanyData();

  const {
    register,
    handleSubmit,
    control,
    resetField,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues,
  });

  const { ref, onChange, ...logoRest } = register("logo");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file?.size > MAX_SIZE) {
      toast.error(t("common.warning"), {
        description: t("company.logoSizeSupportedError"),
      });
      return;
    }

    if (!file?.type.startsWith("image/")) {
      toast.error(t("common.warning"), {
        description: t("company.logoSizeExtensionError"),
      });
      return;
    }

    setPreviewImg(URL.createObjectURL(file));
  };

  const handleRemoveFile = (): void => {
    setPreviewImg(null);
    resetField("logo");
  };

  useEffect(() => {
    if (companyData) {
      reset({
        name: companyData.name,
        email: companyData.email,
        address: companyData.address,
        identification: companyData.identification,
        phone: companyData.phone,
        currency: companyData.currency,
        logo: companyData.logo ?? undefined,
      });
    }
  }, [companyData, reset]);

  useEffect(() => {
    return () => {
      if (previewImg) {
        URL.revokeObjectURL(previewImg);
      }
    };
  }, [previewImg]);

  const onSubmit: SubmitHandler<CompanyFormData> = (formData) => {
    console.log(formData);
  };

  if (isCompanyDataPending) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{t("company.companyInfo")}</CardTitle>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <FieldSet className="grid grid-cols-1 lg:grid-cols-4">
              <FieldGroup className="col-span-1">
                <Field>
                  <FieldLabel htmlFor="name">
                    <span>{t("company.logo")}</span>
                  </FieldLabel>

                  <div className="flex flex-col items-center">
                    <div className="flex flex-col justify-center h-40 w-40">
                      <label htmlFor="logo" className="cursor-pointer">
                        {previewImg ? (
                          <div className="relative">
                            <img
                              src={previewImg}
                              alt="Logo preview"
                              className="object-contain border rounded-lg h-40 w-40"
                            />
                            <Button
                              type="button"
                              size={"sm"}
                              variant={"destructive"}
                              className="absolute bottom-0 -right-2 rounded-full"
                              onClick={handleRemoveFile}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        ) : (
                          <div className="bg-gray-200 h-full rounded flex flex-col p-4 justify-center items-center hover:bg-gray-300 transition-colors">
                            <CloudUpload size={64} />
                            <span>{t("company.formatSupported")}</span>
                          </div>
                        )}
                      </label>
                    </div>

                    <FieldLabel
                      htmlFor="logo"
                      className="cursor-pointer mt-2 items-center gap-2 border rounded-lg px-4 py-2 w-54 flex justify-center hover:bg-secondary transition-colors"
                    >
                      <Upload size={16} />
                      <span>{t("company.selectFiles")}</span>
                    </FieldLabel>
                  </div>

                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    {...logoRest}
                    ref={ref}
                    onChange={(e) => {
                      onChange(e);
                      handleFileChange(e);
                    }}
                  />
                </Field>
              </FieldGroup>
              <FieldGroup className="col-span-3 grid grid-cols-1 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="name">
                    <span>{t("company.name")}</span>
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
                      {t(errors.email.message as ErrorFormKey)}
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
                    <FieldError>
                      {t(errors.phone.message as ErrorFormKey)}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="address">
                    <span>{t("customers.address")}</span>
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="address" {...register("address")} />
                  {errors.address && (
                    <FieldError>
                      {t(errors.address.message as ErrorFormKey)}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="currency">
                    <span>{t("company.currency")}</span>
                  </FieldLabel>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="currency"
                          //   className={`w-full ${errors.currency ? "border-red-500" : ""}`}
                        >
                          <SelectValue placeholder="Selecciona una moneda" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EURO</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.currency && (
                    <FieldError>
                      {t(errors.currency.message as ErrorFormKey)}
                    </FieldError>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </CardContent>

        <CardFooter className="gap-2 justify-end">
          <Button
            variant={"destructive"}
            type="button"
            /* onClick={handleClose}
              disabled={isSubmitting} */
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant={"success"}
            type="submit"

            //   disabled={isSubmitting}
          >
            {t("common.save")}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default CompanyData;
