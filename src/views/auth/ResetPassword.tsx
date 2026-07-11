import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  FieldSet,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUpdatePassword } from "@/features/auth/presentation/hooks/useUpdatePassword";
import { useRecoverySession } from "@/features/auth/presentation/hooks/useRecoverySession";
import { PATHS } from "@/router/paths";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ParseKeys } from "i18next";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import Loader from "@/components/shared/Loader";

const recoveryPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "errorsForm.auth.passwordRequired8")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "errorsForm.auth.passwordRequiredPattern",
    ),
});

type RecoveryPasswordFormData = z.infer<typeof recoveryPasswordSchema>;
type ErrorFormKey = ParseKeys;

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const updatePassword = useUpdatePassword();
  const { data: user, isLoading } = useRecoverySession();

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
    updatePassword.mutate(formData.password, {
      onSuccess: () => {
        toast.success(t("common.success"), {
          description: t("auth.updatePasswordSuccess"),
        });
        navigate(PATHS.login);
      },
    });
  };

  // Estado 1: verificando si hay sesión → mostramos un loader.
  if (isLoading) {
    return <Loader />;
  }

  // Estado 2: NO hay sesión → el usuario no llegó desde el link del email.
  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
        <h2 className="text-2xl">{t("auth.invalidRecoveryLink")}</h2>
        <Link
          to={PATHS.recoveryPassword}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          {t("auth.forgotPassword")}
        </Link>
      </div>
    );
  }

  // Estado 3: hay sesión válida → mostramos el formulario.
  return (
    <div className="h-screen grid  md:grid-cols-10">
      <div className="hidden md:flex reset-background items-center justify-center col-span-6 "></div>
      <div className="w-full p-12 md:p-24 col-span-4 flex flex-col justify-center">
        <FieldGroup>
          <FieldSet>
            <h2 className="text-center mt-6 text-3xl">
              {t("auth.updatePassword")}
            </h2>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">
                  <span>Password</span>
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
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
