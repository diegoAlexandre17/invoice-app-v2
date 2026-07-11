import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  FieldSet,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ParseKeys } from "i18next";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { z } from "zod";

const recoveryPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "passwordRequired8")
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "passwordRequiredPattern"),
});

type RecoveryPasswordFormData = z.infer<typeof recoveryPasswordSchema>;
type ErrorFormKey = ParseKeys;

const ResetPassword = () => {

  const {t} = useTranslation();

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<RecoveryPasswordFormData>({
      resolver: zodResolver(recoveryPasswordSchema),
      defaultValues: {
        password: "",
      },
    });

    const onSubmit = (formData: RecoveryPasswordFormData) => {
      console.log(formData);
    }

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
                <FieldLabel htmlFor="password">
                  <span>Password</span>
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && (
                  <FieldError>
                    {t(errors.password.message as ErrorFormKey)}
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
              to="/auth/login"
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

export default ResetPassword;
