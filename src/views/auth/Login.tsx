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
import { Eye, EyeClosed } from "lucide-react";
import { useState, type JSX } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("emailRequired"),
  password: z.string().min(1, "passwordRequired"),
});

type ErrorFormKey = keyof typeof en.errorsForm.auth;
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
    <div className="grid grid-cols-1 h-screen">
      {/* <div></div> */}
      <div className="p-12 min-h-screen">
        <FieldGroup>
          <FieldSet>
            <h2 className="text-center mt-6 text-3xl">
              {t("auth.loginSubtitle")}
            </h2>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
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
                <FieldLabel htmlFor="password">
                  <span>{t("common.password")}</span>
                  <span className="text-destructive">*</span>
                </FieldLabel>

                <div className="relative">
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setViewPassword((lastState) => !lastState)}
                  >
                    {viewPassword ? <Eye /> : <EyeClosed />}
                  </div>
                  <Input
                    id="password"
                    type={viewPassword ? "text" : "password"}
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <FieldError>
                    {t(
                      `errorsForm.auth.${errors.password.message as ErrorFormKey}`,
                    )}
                  </FieldError>
                )}
                <Link
                  to="/recovery-password"
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
              to="/register"
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
