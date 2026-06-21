import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  return (
    <div>
      {t("navigation.dashboard")}

      <div>
        <Button variant="secondary">Secondary</Button>
        <Button variant="default">Default</Button>
      </div>
    </div>
  );
};

export default Dashboard;
