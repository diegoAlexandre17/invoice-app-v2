import LanguageSwitcher from "@/components/shared/LanguageSelect";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ParseKeys } from "i18next";
import { Eye, EyeClosed } from "lucide-react";
import { useState, type JSX } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("errorsForm.common.emailRequired"),
  password: z.string().min(1, "errorsForm.auth.passwordRequired"),
});

type ErrorFormKey = ParseKeys;
type userLogin = z.infer<typeof loginSchema>;

const Login = (): JSX.Element => {
  const [viewPassword, setViewPassword] = useState<boolean>(false);

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<userLogin> = (formData) => {
    console.log(formData);
  };

  return (
    <div className="h-screen grid  md:grid-cols-10">
      <div className="hidden md:flex login-background  items-center justify-center col-span-6 ">
        <h1 className="text-white text-6xl">{t("auth.loginTitle")}</h1>
      </div>
      <div className="w-full p-12 md:p-24 col-span-4 flex flex-col justify-center">
        <FieldGroup>
          <FieldSet>
            <h2 className="text-center mt-6 text-3xl">
              {t("auth.loginSubtitle")}
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
                    {t(errors.email.message as ErrorFormKey)}
                  </FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">
                  <span>{t("common.password")}</span>
                  <span className="text-destructive">*</span>
                </FieldLabel>

                <div className="relative">
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setViewPassword((lastState) => !lastState)}
                  >
                    {viewPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
                  </div>
                  <Input
                    id="password"
                    type={viewPassword ? "text" : "password"}
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <FieldError>
                    {t(errors.password.message as ErrorFormKey)}
                  </FieldError>
                )}
                <Link
                  to="/auth/recovery-password"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  {t("auth.forgotPassword")}
                </Link>
              </Field>

              <Field>
                <Button onClick={handleSubmit(onSubmit)}>
                  {t("common.login")}
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>

        <div className="mt-5">
          <p className="text-sm flex justify-center items-center gap-2">
            {t("auth.noAccount")}
            <Link
              to="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t("auth.signUp")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
