import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/features/auth/presentation/hooks/useLogin";
import { PATHS } from "@/router/paths";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import type { ParseKeys } from "i18next";
import { Eye, EyeClosed } from "lucide-react";
import { useRef, useState, type JSX } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const captchaKey = import.meta.env.VITE_HCAPTCHA_SITEKEY;

const loginSchema = z.object({
  email: z.email("errorsForm.common.emailRequired"),
  password: z.string().min(1, "errorsForm.auth.passwordRequired"),
});

type ErrorFormKey = ParseKeys;
type userLogin = z.infer<typeof loginSchema>;

const Login = (): JSX.Element => {
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string | undefined>();

  const captcha = useRef<HCaptcha>(null);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useLogin();
  const queryClient = useQueryClient();

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
    if (!captchaToken) {
      return;
    }

    login.mutate(
      { ...formData, captchaToken },
      {
        onSuccess: (user) => {
          queryClient.setQueryData(["session"], user);
          navigate(PATHS.dashboard);
        },
        onError: (error) => {
          toast.error(t("common.warning"), {
            description: t(error.message as ParseKeys),
          });
        },
        onSettled: () => {
          // El token de hCaptcha es de un solo uso: reseteamos tras cada
          // intento (éxito o error) para que un nuevo submit tenga token válido.
          captcha.current?.resetCaptcha();
          setCaptchaToken(undefined);
        },
      },
    );
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

              <div className="flex justify-center">
                <HCaptcha
                  ref={captcha}
                  sitekey={captchaKey}
                  onVerify={(token) => {
                    setCaptchaToken(token);
                  }}
                />
              </div>

              <Field>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={login.isPending || !captchaToken}
                >
                  {login.isPending ? t("common.loading") : t("common.login")}
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
