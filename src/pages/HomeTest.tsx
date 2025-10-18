import { ArrowRight, Zap, Shield, Download, Smartphone, FileText, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import linkrLogo from "@/assets/linkr-logo.png";
import { Link } from "react-router-dom";
import { QRTemplateSelectorTest } from "@/components/QRTemplateSelectorTest";
import { type QRTemplate } from "@/data/qrTemplates";
import { useState } from "react";

export default function HomeTest() {
  const [url, setUrl] = useState("");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [selectedTemplate, setSelectedTemplate] = useState<QRTemplate | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTemplateSelect = (template: QRTemplate) => {
    setSelectedTemplate(template);
    setForegroundColor(template.fg);
    setBackgroundColor(template.bg);
  };

  const generateQRCode = async () => {
    if (!url.trim()) {
      alert("Please enter a URL");
      return;
    }

    setIsLoading(true);
    try {
      // Format the URL properly
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }

      console.log("Generating QR for:", formattedUrl);
      
      const response = await fetch("http://localhost:8000/generate-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: formattedUrl,
          foreground_color: foregroundColor,
          background_color: backgroundColor,
          format: "png", // Always use PNG for preview
        }),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const blob = await response.blob();
        console.log("Blob size:", blob.size);
        const imageUrl = URL.createObjectURL(blob);
        setQrCodeImage(imageUrl);
        console.log("QR Code generated successfully");
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert(`Failed to generate QR code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert(`Error generating QR code: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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
      description: "Download your QR codes in PNG, JPG, PDF, or SVG formats.",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Perfect responsive design for all your devices.",
    },
  ];

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative py-20 px-4 text-center'>
        <div className='container mx-auto max-w-4xl'>
          <div className='mb-8 flex justify-center'>
            <img
              src={linkrLogo}
              alt='linkr logo'
              className='h-20 w-20 object-contain animate-glow'
            />
          </div>
          <h1 className='text-4xl md:text-6xl font-bold mb-6 text-glow'>
            Generate{" "}
            <span className='text-transparent bg-clip-text bg-gradient-primary animate-pulse'>
              QR Codes
            </span>{" "}
            Instantly
          </h1>
          <p className='text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
            Transform any URL into a beautiful, scannable QR code with custom colors and multiple download formats.
          </p>
          <Link to='/templates'>
            <Button size='lg' className='group'>
              Get Started
              <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Button>
          </Link>
        </div>
      </section>

      {/* QR Generator Section - Simplified */}
      <section className='py-16 px-4'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4 text-glow'>
              Quick QR Generator
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              Enter any URL below and generate a QR code instantly. Customize colors and download in your preferred format.
            </p>
          </div>

          <div className='max-w-6xl mx-auto'>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* QR Generator Form */}
              <div className="space-y-6">
                <Card className='glass-card'>
                  <CardHeader>
                    <CardTitle className='text-center text-glow'>Generate QR Code</CardTitle>
                    <CardDescription className='text-center'>
                      Enter a URL and customize your QR code
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {/* URL Input */}
                    <div>
                      <Label htmlFor="url">Enter URL</Label>
                      <input
                        id="url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 mt-1 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green"
                      />
                    </div>

                    {/* Custom Colors */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fg-color">Foreground Color</Label>
                        <div className="flex gap-2 mt-1">
                          <input
                            id="fg-color"
                            type="color"
                            value={foregroundColor}
                            onChange={(e) => setForegroundColor(e.target.value)}
                            className="w-12 h-10 rounded border cursor-pointer flex-shrink-0"
                          />
                          <input
                            type="text"
                            value={foregroundColor}
                            onChange={(e) => setForegroundColor(e.target.value)}
                            className="flex-1 px-3 py-2 bg-background border rounded-md text-sm min-w-0"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bg-color">Background Color</Label>
                        <div className="flex gap-2 mt-1">
                          <input
                            id="bg-color"
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-12 h-10 rounded border cursor-pointer flex-shrink-0"
                          />
                          <input
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="flex-1 px-3 py-2 bg-background border rounded-md text-sm min-w-0"
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Download Format */}
                    <div>
                      <Label htmlFor="format">Download Format</Label>
                      <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="jpg">JPG</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="svg">SVG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Selected Template Info */}
                    {selectedTemplate && (
                      <div className="p-3 bg-neon-green/10 border border-neon-green/30 rounded-md">
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4 text-neon-green" />
                          <span className="text-sm font-medium">Selected Template:</span>
                          <span className="text-sm text-neon-green">{selectedTemplate.name}</span>
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full" 
                      onClick={generateQRCode}
                      disabled={isLoading}
                    >
                      {isLoading ? "Generating..." : "Generate QR Code"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Template Selector */}
                <QRTemplateSelectorTest onTemplateSelect={handleTemplateSelect} />
              </div>

              {/* QR Code Preview */}
              <div className="xl:sticky xl:top-4">
                <Card className='glass-card'>
                  <CardHeader>
                    <CardTitle className='text-center text-glow'>QR Code Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center min-h-[400px] p-6">
                    {qrCodeImage ? (
                      <div className="text-center space-y-4 w-full">
                        <div className="flex justify-center">
                          <img 
                            src={qrCodeImage} 
                            alt="Generated QR Code"
                            className="max-w-[280px] h-auto rounded-lg border-2 border-neon-green/30 shadow-lg"
                            style={{ 
                              maxHeight: '280px',
                              objectFit: 'contain'
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            QR Code for: <span className="text-neon-green">{url}</span>
                          </p>
                          <Button 
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = qrCodeImage;
                              link.download = `qr-code.${downloadFormat}`;
                              link.click();
                            }}
                            className="w-full"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download as {downloadFormat.toUpperCase()}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                          <span className="text-4xl">📱</span>
                        </div>
                        <p className="text-lg font-medium mb-2">Your QR code will appear here</p>
                        <p className="text-sm">Enter a URL and click generate to create your QR code</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 px-4'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4 text-glow'>
              Why Choose linkr?
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              Built with modern technology and user experience in mind. Generate professional QR codes with ease.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className='glass-card group hover:glass-card-hover transition-all duration-300'>
                  <CardHeader className='text-center'>
                    <div className='mx-auto w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:animate-glow'>
                      <Icon className='h-6 w-6 text-background' />
                    </div>
                    <CardTitle className='text-lg group-hover:text-neon-green transition-colors'>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className='text-center'>
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}