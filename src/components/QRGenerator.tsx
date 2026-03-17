import { useState, useEffect } from "react";
import { Download, Link as LinkIcon, Loader2, CheckCircle, AlertCircle, Clipboard, ClipboardCheck, Palette, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "./ErrorMessage";
import { QRTemplateSelector } from "./QRTemplateSelector";
import { type QRTemplate } from "@/data/qrTemplates";
import { throttle } from "@/utils/throttle";
import { showNotification } from "@/utils/ShowNotification";
import { saveToHistory } from "@/utils/qrHistory";

export function QRGenerator() {
  const [url, setUrl] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [formattedUrl, setFormattedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isQRCodeCopiedToClipboard, setIsQRCodeCopiedToClipboard] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [errorCorrection, setErrorCorrection] = useState("H");
  const [size, setSize] = useState("medium");
  const [border, setBorder] = useState(4);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  // Logo state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const validateUrl = (inputUrl: string): boolean => {
    try {
      new URL(inputUrl);
      return true;
    } catch {
      // If URL constructor fails, try adding https://
      try {
        new URL(`https://${inputUrl}`);
        return true;
      } catch {
        return false;
      }
    }
  };

  const formatUrl = (inputUrl: string): string => {
    try {
      new URL(inputUrl);
      return inputUrl;
    } catch {
      return `https://${inputUrl}`;
    }
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError("");
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validate file size (2MB max)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setLogoError("Logo file size must be less than 2MB");
      return;
    }
    
    // Validate file type
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      setLogoError("Unsupported file format. Use PNG, JPG, or SVG");
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setLogoPreview(preview);
    };
    reader.readAsDataURL(file);
    
    setLogoFile(file);
    showNotification(
      "Logo Selected!",
      `${file.name} is ready to be embedded in your QR code`,
      "/success-icon.png"
    );
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoError("");
  };

  useEffect(() => { // Reset Copy to clip board icon and button text after 10s.
    if (isQRCodeCopiedToClipboard) {
      const timer = setTimeout(() => setIsQRCodeCopiedToClipboard(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [isQRCodeCopiedToClipboard]);

  const handleCopyQRCodeToClipboard = async () => {
    if (!qrCodeImage) return;

    try {
      const response = await fetch(qrCodeImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      
      setIsQRCodeCopiedToClipboard(true);
      showNotification(
        "QR Code Copied!",
        "Your QR code has been successfully copied to the clipboard.",
        "/success-icon.png"
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    }
  }

  const throttledCopyQRCode = throttle(handleCopyQRCodeToClipboard, 5000);

  const handleGenerate = async () => {
    if (!url.trim()) {
      setError("Please enter a URL to generate a QR code.");
      return;
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid URL. The URL format is incorrect.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("url", url);
      formData.append("foreground_color", foregroundColor);
      formData.append("background_color", backgroundColor);
      formData.append("format", downloadFormat);
      formData.append("error_correction", errorCorrection);
      formData.append("size", size);
      formData.append("border", border.toString());
      
      // Add logo if selected
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await fetch(`${API_BASE_URL}/generate-qr`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate QR code due to a server error.");
      }

      const data = await response.json();
      setQrCodeImage(data.qr_code);
      setFormattedUrl(data.formatted_url);
      setIsLoading(false);
      setSuccess(true);
      
      // Save to history
      saveToHistory({
        url: data.formatted_url || url,
        foregroundColor,
        backgroundColor,
        format: downloadFormat,
        size,
        errorCorrection,
        qrCodeData: data.qr_code,
        templateName: selectedTemplate || undefined,
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (qrCodeImage) {
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-code.${downloadFormat}`;
      downloadLink.href = qrCodeImage;
      downloadLink.click();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGenerate();
    }
  };

  const handleTemplateSelect = (template: QRTemplate) => {
    setForegroundColor(template.fg);
    setBackgroundColor(template.bg);
    setSelectedTemplate(template.id);
    
    // Show notification about template selection
    showNotification(
      `${template.name} Template Applied`,
      `Colors updated to ${template.description.toLowerCase()}`,
      "/template-icon.png"
    );
  };

  return (
    <div className='w-full max-w-2xl mx-auto space-y-8'>
      {/* Input Section */}
      <Card className='glass-effect border-border/50 hover:border-neon-green/50 transition-all duration-300'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-neon-green'>
            <LinkIcon className='h-5 w-5' />
            Generate QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <div className='relative'>
              <Input
                type='url'
                placeholder='Enter URL (e.g., https://example.com or example.com)'
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                className='pr-12 h-12 text-base border-border focus:border-neon-green focus:ring-neon-green/20 transition-all duration-300'
              />
              <LinkIcon className='absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
            </div>
          </div>

          {error && <ErrorMessage error={error} onRetry={handleGenerate} />}

          {success && (
            <Alert className='border-neon-green/50 bg-neon-green/10'>
              <CheckCircle className='h-4 w-4 text-neon-green' />
              <AlertDescription className='text-neon-green'>QR code generated successfully!</AlertDescription>
            </Alert>
          )}

          {/* QR Code Templates */}
          <QRTemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            currentColors={{
              fg: foregroundColor,
              bg: backgroundColor
            }}
          />

          {/* Logo Upload Section */}
          <Card className='border-border/30 bg-card/50'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-sm text-muted-foreground'>
                <ImageIcon className='h-4 w-4' />
                Logo for QR Code (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='logo-upload' className='text-sm font-medium'>
                  Upload Logo (PNG, JPG, SVG - Max 2MB)
                </Label>
                <div className='flex items-center gap-2'>
                  <Input
                    id='logo-upload'
                    type='file'
                    accept='image/png,image/jpeg,image/jpg,image/svg+xml'
                    onChange={handleLogoSelect}
                    className='cursor-pointer'
                  />
                  {logoFile && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={handleRemoveLogo}
                      className='text-red-500 hover:text-red-700'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
                {logoError && (
                  <Alert className='border-red-500/50 bg-red-500/10'>
                    <AlertCircle className='h-4 w-4 text-red-500' />
                    <AlertDescription className='text-red-500'>{logoError}</AlertDescription>
                  </Alert>
                )}
              </div>

              {logoPreview && (
                <div className='space-y-2'>
                  <p className='text-sm text-muted-foreground'>Logo Preview:</p>
                  <div className='border border-border/50 rounded-lg p-3 flex justify-center bg-white'>
                    <img
                      src={logoPreview}
                      alt='Logo Preview'
                      className='max-h-24 max-w-24 object-contain'
                    />
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    The logo will be embedded in the center of your QR code (25% of size) to maintain scannability.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className='border-border/30 bg-card/50'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Palette className='h-4 w-4' />
                Customization Options
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {/* Download Format */}
                <div className='space-y-2'>
                  <Label htmlFor='format' className='text-sm font-medium'>
                    Download Format
                  </Label>
                  <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                    <SelectTrigger className='border-border focus:border-neon-green'>
                      <SelectValue placeholder='Select format' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='png'>PNG</SelectItem>
                      <SelectItem value='jpg'>JPG</SelectItem>
                      <SelectItem value='pdf'>PDF</SelectItem>
                      <SelectItem value='svg'>SVG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Error Correction Level */}
                <div className='space-y-2'>
                  <Label htmlFor='error-correction' className='text-sm font-medium'>
                    Error Correction
                  </Label>
                  <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                    <SelectTrigger className='border-border focus:border-neon-green'>
                      <SelectValue placeholder='Select level' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='L'>Low (L)</SelectItem>
                      <SelectItem value='M'>Medium (M)</SelectItem>
                      <SelectItem value='Q'>Quartile (Q)</SelectItem>
                      <SelectItem value='H'>High (H)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Size */}
                <div className='space-y-2'>
                  <Label htmlFor='size' className='text-sm font-medium'>
                    Size
                  </Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger className='border-border focus:border-neon-green'>
                      <SelectValue placeholder='Select size' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='small'>Small</SelectItem>
                      <SelectItem value='medium'>Medium</SelectItem>
                      <SelectItem value='large'>Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {/* Foreground Color */}
                <div className='space-y-2'>
                  <Label htmlFor='foreground' className='text-sm font-medium'>
                    QR Code Color
                  </Label>
                  <div className='flex gap-2'>
                    <input
                      type='color'
                      id='foreground'
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className='w-12 h-10 rounded border border-border cursor-pointer'
                    />
                    <Input
                      type='text'
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className='flex-1 h-10 text-xs border-border focus:border-neon-green'
                      placeholder='#000000'
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div className='space-y-2'>
                  <Label htmlFor='background' className='text-sm font-medium'>
                    Background Color
                  </Label>
                  <div className='flex gap-2'>
                    <input
                      type='color'
                      id='background'
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className='w-12 h-10 rounded border border-border cursor-pointer'
                    />
                    <Input
                      type='text'
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className='flex-1 h-10 text-xs border-border focus:border-neon-green'
                      placeholder='#ffffff'
                    />
                  </div>
                </div>

                {/* Border Thickness */}
                <div className='space-y-2'>
                  <Label htmlFor='border' className='text-sm font-medium'>
                    Border Thickness
                  </Label>
                  <Select value={border.toString()} onValueChange={(value) => setBorder(parseInt(value))}>
                    <SelectTrigger className='border-border focus:border-neon-green'>
                      <SelectValue placeholder='Select thickness' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='1'>Thin (1)</SelectItem>
                      <SelectItem value='2'>Light (2)</SelectItem>
                      <SelectItem value='3'>Medium (3)</SelectItem>
                      <SelectItem value='4'>Thick (4)</SelectItem>
                      <SelectItem value='5'>Extra Thick (5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className='w-full h-12 text-base bg-gradient-primary hover:bg-gradient-primary/90 transition-all duration-300 hover:glow-effect'
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                Generating...
              </>
            ) : (
              "Generate QR Code"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* QR Code Display */}
      {qrCodeImage && (
        <Card className='glass-effect border-border/50 hover:border-neon-green/50 transition-all duration-300 animate-fade-in'>
          <CardHeader>
            <CardTitle className='text-center text-neon-green'>Your QR Code</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex justify-center'>
              <div id='qr-code' className='p-4 bg-white rounded-lg shadow-lg'>
                <img
                  src={qrCodeImage}
                  alt='QR Code'
                  className='max-w-full h-auto'
                  style={{ maxWidth: "256px", maxHeight: "256px" }}
                />
              </div>
            </div>

            <div className='text-center space-y-2'>
              <p className='text-sm text-muted-foreground'>Scan with your phone camera</p>
              <p className='text-xs text-muted-foreground break-all'>{formattedUrl}</p>
            </div>

            {isQRCodeCopiedToClipboard && (
              <Alert className='border-neon-green/50 bg-neon-green/10'>
                <CheckCircle className='h-4 w-4 text-neon-green' />
                <AlertDescription className='text-neon-green'>Copied QR code to clipboard!</AlertDescription>
              </Alert>
            )}

            <div className="flex-col sm:flex-row flex gap-5">
                <Button 
                  variant={isQRCodeCopiedToClipboard ? 'default' : 'outline'}
                  disabled={isQRCodeCopiedToClipboard}
                  onClick={throttledCopyQRCode}
                >
                  {
                    isQRCodeCopiedToClipboard ? (
                      <>
                        <ClipboardCheck className='mr-2 h-4 w-4' />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Clipboard className='mr-2 h-4 w-4' />
                        Copy QR Code
                      </>
                    )
                  }
                </Button>
                <Button
                  onClick={handleDownload}
                  variant='outline'
                  className='w-full border-neon-green text-neon-green hover:bg-neon-green hover:text-primary-foreground transition-all duration-300'
                >
                  <Download className='mr-2 h-4 w-4' />
                  Download {downloadFormat.toUpperCase()}
                </Button>
              </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
