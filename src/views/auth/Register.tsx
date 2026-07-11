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
import { Eye, EyeClosed } from "lucide-react";
import { useState, type JSX } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { ParseKeys } from "i18next";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useRegister } from "@/features/auth/presentation/hooks/useRegister";
import { PATHS } from "@/router/paths";
import { toast } from "sonner";
import TextErrorSmall from "@/components/shared/TextErrorSmall";

const registerSchema = z.object({
  name: z.string().min(1, "errorsForm.common.nameRequired"),
  email: z.email("errorsForm.common.emailRequired"),
  password: z
    .string()
    .min(8, "errorsForm.auth.passwordRequired8")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "errorsForm.auth.passwordRequiredPattern",
    ),
});

type RegisterFormData = z.infer<typeof registerSchema>;
type ErrorFormKey = ParseKeys;

const Register = (): JSX.Element => {
  const [viewPassword, setViewPassword] = useState<boolean>(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const registerUser = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormData> = (formData) => {
    registerUser.mutate(formData, {
      onSuccess: () => {
        toast.success(t("auth.registerSuccessTitle"), {
          description: t("auth.validateEmail"),
        });
        navigate(PATHS.login);
      },
    });
  };

  return (
    <div className="h-screen grid  md:grid-cols-10">
      <div className="w-full p-12 md:p-24 col-span-4 flex flex-col justify-center">
        <FieldGroup>
          <FieldSet>
            <h2 className="text-center mt-6 text-3xl">
              {t("auth.createAccount")}
            </h2>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">
                  <span>{t("common.name")}</span>
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
              </Field>

              <Field>
                {registerUser.isError && (
                  <TextErrorSmall error={registerUser.error.message} />
                )}
              </Field>

              <Field>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={registerUser.isPending}
                >
                  {registerUser.isPending
                    ? t("common.loading")
                    : t("auth.signUp")}
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>

        <div className="mt-5">
          <p className="text-sm flex justify-center items-center gap-2">
            {t("auth.haveAccount")}
            <Link
              to="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t("auth.signIn")}
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden md:flex register-background items-center justify-center col-span-6 "></div>
    </div>
  );
};

export default Register;
