import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-neon-green text-glow">404</h1>
        <p className="text-xl text-muted-foreground">{t("errors.pageNotFound")}</p>
        <p className="text-sm text-muted-foreground">{t("errors.pageNotFoundMsg")}</p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg hover:glow-effect transition-all duration-300"
        >
          {t("errors.goHome")}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
