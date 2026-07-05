import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import en from "@/i18n/locales/en.json";
import { zodResolver } from "@hookform/resolvers/zod";
import { type JSX } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { z } from "zod";

const recoverySchema = z.object({
  email: z.email("emailRequired"),
});

type RecoveryFormData = z.infer<typeof recoverySchema>;
type ErrorFormKey = keyof typeof en.errorsForm.auth;

const RecoveryPassword = (): JSX.Element => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<RecoveryFormData> = (formData) => {
    console.log(formData);
  };

  return (
    <div className="h-screen grid  md:grid-cols-10">
      <div className="hidden md:flex reset-background items-center justify-center col-span-6 "></div>
      <div className="w-full p-12 md:p-24 col-span-4 flex flex-col justify-center">
        <FieldGroup>
          <FieldSet>
            <h2 className="text-center mt-6 text-3xl">
              {t("auth.recoveryTitle")}
            </h2>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">
                  <span>Email</span>
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <Input id="email" {...register("email")} />
                {errors.email && (
                  <FieldError>
                    {t(
                      `errorsForm.auth.${errors.email.message as ErrorFormKey}`,
                    )}
                  </FieldError>
                )}
              </Field>

              <Field>
                <Button onClick={handleSubmit(onSubmit)}>
                  {t("auth.recover")}
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>

        <div className="mt-5">
          <p className="text-sm flex justify-center items-center gap-2">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t("common.goBack")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecoveryPassword;
