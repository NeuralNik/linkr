import { ArrowRight, Zap, Shield, Download, Smartphone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRGenerator } from "@/components/QRGenerator";
import linkrLogo from "@/assets/linkr-logo.png";
import { Link } from "react-router-dom";
import { QRScanner } from "@/components/QRScanner";

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate QR codes instantly with our optimized algorithm.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data stays safe. No URLs are stored on our servers.",
    },
    {
      icon: Download,
      title: "Multiple Formats",
      description: "Download your QR codes in PNG, JPG, PDF, or SVG format.",
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Scan with any smartphone camera or QR code reader app.",
    },
  ];

  const scrollToGenerator = () => {
    document.getElementById("qr-generator")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToScanner = () => {
    document.getElementById("qr-scanner")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className='min-h-screen'>
      {/* Hero Section */}
      <section className='py-20 md:py-32'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-8 max-w-4xl mx-auto'>
            <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold leading-tight'>
              Generate <span className='text-neon-green'>QR Codes</span>
              <br />
              Instantly
            </h1>

            <p className='text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto'>
              Convert any URL into a scannable QR code in seconds. Fast, free, and secure.
            </p>

            <div className='flex justify-center gap-3 flex-wrap'>
              <Button
                size='lg'
                onClick={scrollToGenerator}
                className='text-lg px-8 py-6 bg-gradient-primary hover:bg-gradient-primary/90 transition-all duration-300 hover:glow-effect group'
              >
                Get Started
                <ArrowRight className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300' />
              </Button>
              <Button
                variant='outline'
                size='lg'
                onClick={scrollToScanner}
                className='text-lg px-8 py-6 border-neon-green text-neon-green hover:bg-neon-green hover:text-primary-foreground transition-all duration-300 hover:glow-effect group'
              >
                Scan QR Code
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
                  <FileText className='mr-2 h-5 w-5' />
                  Batch Generate
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
              Why Choose Our <span className='text-neon-green text-glow'>QR Generator</span>
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              Experience the perfect blend of speed, security, and simplicity
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
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
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-center'>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id='qr-scanner' className='py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-4 mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold'>
              Scan an existing <span className='text-neon-green text-glow'>QR Code</span>
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>Use your device camera to detect QR codes in real-time</p>
          </div>
          <QRScanner />
        </div>
      </section>

      {/* QR Generator Section */}
      <section id='qr-generator' className='py-20 min-h-screen'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-4 mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold'>
              Generate Your <span className='text-neon-green text-glow'>QR Code</span>
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>Enter any URL and get your QR code instantly</p>
          </div>

          <QRGenerator />
        </div>
      </section>
    </main>
  );
}
