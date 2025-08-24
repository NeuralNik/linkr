import { useState } from 'react';
import { Download, Link as LinkIcon, Loader2, CheckCircle, AlertCircle, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function QRGenerator() {
  const [url, setUrl] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [formattedUrl, setFormattedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('png');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const API_BASE_URL = 'http://localhost:8000';

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

  const handleGenerate = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url,
          foreground_color: foregroundColor,
          background_color: backgroundColor,
          format: downloadFormat
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate QR code');
      }

      const data = await response.json();
      setQrCodeImage(data.qr_code);
      setFormattedUrl(data.formatted_url);
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code. Make sure the backend server is running.');
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (qrCodeImage) {
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-code.${downloadFormat}`;
      downloadLink.href = qrCodeImage;
      downloadLink.click();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Input Section */}
      <Card className="glass-effect border-border/50 hover:border-neon-green/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neon-green">
            <LinkIcon className="h-5 w-5" />
            Generate QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="url"
                placeholder="Enter URL (e.g., https://example.com or example.com)"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                className="pr-12 h-12 text-base border-border focus:border-neon-green focus:ring-neon-green/20 transition-all duration-300"
              />
              <LinkIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-neon-green/50 bg-neon-green/10">
              <CheckCircle className="h-4 w-4 text-neon-green" />
              <AlertDescription className="text-neon-green">
                QR code generated successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Customization Options */}
          <Card className="border-border/30 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <Palette className="h-4 w-4" />
                Customization Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Download Format */}
                <div className="space-y-2">
                  <Label htmlFor="format" className="text-sm font-medium">Download Format</Label>
                  <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                    <SelectTrigger className="border-border focus:border-neon-green">
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

                {/* Foreground Color */}
                <div className="space-y-2">
                  <Label htmlFor="foreground" className="text-sm font-medium">QR Code Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="foreground"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="w-12 h-10 rounded border border-border cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="flex-1 h-10 text-xs border-border focus:border-neon-green"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div className="space-y-2">
                  <Label htmlFor="background" className="text-sm font-medium">Background Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="background"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 rounded border border-border cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 h-10 text-xs border-border focus:border-neon-green"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full h-12 text-base bg-gradient-primary hover:bg-gradient-primary/90 transition-all duration-300 hover:glow-effect"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate QR Code'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* QR Code Display */}
      {qrCodeImage && (
        <Card className="glass-effect border-border/50 hover:border-neon-green/50 transition-all duration-300 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-center text-neon-green">Your QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div id="qr-code" className="p-4 bg-white rounded-lg shadow-lg">
                <img
                  src={qrCodeImage}
                  alt="QR Code"
                  className="max-w-full h-auto"
                  style={{ maxWidth: '256px', maxHeight: '256px' }}
                />
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Scan with your phone camera</p>
              <p className="text-xs text-muted-foreground break-all">{formattedUrl}</p>
            </div>

            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full border-neon-green text-neon-green hover:bg-neon-green hover:text-primary-foreground transition-all duration-300"
            >
              <Download className="mr-2 h-4 w-4" />
              Download {downloadFormat.toUpperCase()}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}