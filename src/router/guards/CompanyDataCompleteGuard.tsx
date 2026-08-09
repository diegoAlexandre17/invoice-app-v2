import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isCompanyDataComplete } from "@/features/company/domain/isCompanyDataComplete";
import { useGetCompanyData } from "@/features/company/presentation/useGetCompanyData";
import { AlertCircle, Building } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router";

const CompanyDataCompleteGuard = () => {
  const { t } = useTranslation();

  const { data: companyData, isPending: isCompanyDataPending } =
    useGetCompanyData();

  const isDataComplete = isCompanyDataComplete(companyData ?? null);

  if (isCompanyDataPending) return <Loader />;
  if (!isDataComplete) {
    return (
      <div>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-xl font-semibold">
              {t("navigation.accessRestricted")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("navigation.companyDataRequired")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("navigation.companyInfoRequired")}
            </p>
            <div className="flex justify-center gap-2">
              <Button>
                <Link to="/admin/company" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {t("navigation.configureCompany")}
                </Link>
              </Button>
              <Button variant="outline">
                <Link to="/admin/dashboard">
                  {t("navigation.backToDashboard")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <Outlet />;
};

export default CompanyDataCompleteGuard;
