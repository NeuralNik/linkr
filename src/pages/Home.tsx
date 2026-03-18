import { ArrowRight, Zap, Shield, Download, Smartphone, Palette, Zap as Batch } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRGenerator } from "@/components/QRGenerator";
import linkrLogo from "@/assets/linkr-logo.png";
import { Link } from "react-router-dom";

export default function Home() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Zap,
      titleKey: "features.fast.title",
      descriptionKey: "features.fast.description",
    },
    {
      icon: Shield,
      titleKey: "features.secure.title",
      descriptionKey: "features.secure.description",
    },
    {
      icon: Download,
      titleKey: "features.formats.title",
      descriptionKey: "features.formats.description",
    },
    {
      icon: Smartphone,
      titleKey: "features.mobile.title",
      descriptionKey: "features.mobile.description",
    },
    {
      icon: Palette,
      titleKey: "features.custom.title",
      descriptionKey: "features.custom.description",
    },
    {
      icon: Batch,
      titleKey: "features.batch.title",
      descriptionKey: "features.batch.description",
    },
  ];

  const scrollToGenerator = () => {
    document.getElementById("qr-generator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className='min-h-screen'>
      {/* Hero Section */}
      <section className='py-20 md:py-32'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-8 max-w-4xl mx-auto'>
            <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold leading-tight'>
              {t("hero.title").split("QR Codes")[0]}
              <span className='text-neon-green'>QR Codes</span>
              <br />
              {t("hero.title").split("QR Codes")[1]}
            </h1>

            <p className='text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto'>
              {t("hero.subtitle")}
            </p>

            <div className='flex justify-center'>
              <Button
                size='lg'
                onClick={scrollToGenerator}
                className='text-lg px-8 py-6 bg-gradient-primary hover:bg-gradient-primary/90 transition-all duration-300 hover:glow-effect group'
              >
                {t("hero.cta")}
                <ArrowRight className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300' />
              </Button>
            </div>

            <div className='flex justify-center'>
              <Link to='/batch'>
                <Button
                  variant='outline'
                  size='lg'
                  className='text-lg px-8 py-6 border-neon-green text-neon-green hover:bg-neon-green hover:text-primary-foreground transition-all duration-300 hover:glow-effect group'
                >
                  {t("nav.batch")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-card/30'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-4 mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold'>
              {t("hero.title").split("Generate")[0]}
              <span className='text-neon-green text-glow'>{t("nav.home")}</span>
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              {t("hero.subtitle")}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <Card
                key={index}
                className='glass-effect border-border/50 hover:border-neon-green/50 transition-all duration-300 hover:glow-effect group'
              >
                <CardHeader className='text-center'>
                  <div className='mx-auto w-12 h-12 mb-4 p-3 rounded-lg bg-gradient-primary group-hover:animate-glow transition-all duration-300'>
                    <feature.icon className='w-6 h-6 text-primary-foreground' />
                  </div>
                  <CardTitle className='text-neon-green group-hover:text-glow transition-all duration-300'>
                    {t(feature.titleKey)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-center'>
                    {t(feature.descriptionKey)}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* QR Generator Section */}
      <section id='qr-generator' className='py-20 min-h-screen'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-4 mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold'>
              {t("home.title")}
              <span className='text-neon-green text-glow'> {t("nav.home")}</span>
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>{t("home.subtitle")}</p>
          </div>

          <QRGenerator />
        </div>
      </section>
    </main>
  );
}
