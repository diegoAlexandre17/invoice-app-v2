import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  return (
    <div>
      {t("navigation.dashboard")}
    </div>
  )
}

export default Dashboard