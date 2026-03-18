import { ArrowRight, Upload, FileText, Loader2, CheckCircle, AlertCircle, Download, Palette } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@/components/ErrorMessage";
import { QRTemplateSelector } from "@/components/QRTemplateSelector";
import { type QRTemplate } from "@/data/qrTemplates";
import { useState } from "react";

interface BatchResult {
  url: string;
  success: boolean;
  error?: string;
  qr_code?: string;
}

export default function Batch() {
  const { t } = useTranslation();
  const [urls, setUrls] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [results, setResults] = useState<BatchResult[]>([]);
  const [zipFile, setZipFile] = useState("");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [errorCorrection, setErrorCorrection] = useState("H");
  const [size, setSize] = useState("medium");
  const [border, setBorder] = useState(4);
  const [inputMethod, setInputMethod] = useState<"manual" | "csv">("manual");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const validateUrls = (urlList: string[]): { valid: string[]; invalid: string[] } => {
    const valid: string[] = [];
    const invalid: string[] = [];

    urlList.forEach((url) => {
      const trimmed = url.trim();
      if (!trimmed) return;

      try {
        new URL(trimmed);
        valid.push(trimmed);
      } catch {
        try {
          new URL(`https://${trimmed}`);
          valid.push(trimmed);
        } catch {
          invalid.push(trimmed);
        }
      }
    });

    return { valid, invalid };
  };

  const handleGenerate = async () => {
    let urlList: string[] = [];

    if (inputMethod === "manual") {
      if (!urls.trim()) {
        setError(t("validation.required"));
        return;
      }
      urlList = urls.split("\n").filter((url) => url.trim());
    } else {
      if (!csvFile) {
        setError(t("batch.selectFile"));
        return;
      }
    }

    if (inputMethod === "manual") {
      const { valid, invalid } = validateUrls(urlList);
      if (valid.length === 0) {
        setError(t("validation.invalidUrl"));
        return;
      }
      if (invalid.length > 0) {
        setError(`Invalid URLs found: ${invalid.join(", ")}`);
        return;
      }
    }

    setIsLoading(true);
    setError("");
    setProgress(0);
    setResults([]);
    setZipFile("");

    try {
      let response: Response;

      if (inputMethod === "manual") {
        setProgress(25);
        response = await fetch(`${API_BASE_URL}/generate-qr-batch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            urls: urlList,
            foreground_color: foregroundColor,
            background_color: backgroundColor,
            format: "png",
            error_correction: errorCorrection,
            size: size,
            border: border,
          }),
        });
        setProgress(75);
      } else {
        // CSV upload
        setProgress(25);
        const formData = new FormData();
        formData.append("file", csvFile!);
        formData.append("foreground_color", foregroundColor);
        formData.append("background_color", backgroundColor);
        formData.append("format", "png");
        formData.append("error_correction", errorCorrection);
        formData.append("size", size);
        formData.append("border", border.toString());

        response = await fetch(`${API_BASE_URL}/generate-qr-batch-csv`, {
          method: "POST",
          body: formData,
        });
        setProgress(75);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate QR codes.");
      }

      if (inputMethod === "manual") {
        const data = await response.json();
        setResults(data.qr_codes);
        if (data.zip_file) {
          setZipFile(data.zip_file);
        }
      } else {
        // For CSV, the response is a direct download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "qr_codes_batch.zip";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      setProgress(100);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadZip = () => {
    if (zipFile) {
      const downloadLink = document.createElement("a");
      downloadLink.download = "qr_codes_batch.zip";
      downloadLink.href = `data:application/zip;base64,${zipFile}`;
      downloadLink.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      setError("");
    } else {
      setError(t("batch.selectFile"));
      setCsvFile(null);
    }
  };

  const handleTemplateSelect = (template: QRTemplate) => {
    setForegroundColor(template.fg);
    setBackgroundColor(template.bg);
    setSelectedTemplate(template.id);
  };

  const successfulCount = results.filter((r) => r.success).length;
  const failedCount = results.filter((r) => !r.success).length;

  return (
    <main className='min-h-screen py-20'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center space-y-4 mb-16 max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold leading-tight'>
            {t('batch.titleStart')} <span className='text-neon-green'>{t('batch.titleEnd')}</span>
          </h1>

          <p className='text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto'>
            {t('batch.subtitle')}
          </p>
        </div>

        <div className='max-w-4xl mx-auto space-y-8'>
          {/* Input Method Selection */}
          <Card className='glass-effect border-border/50'>
            <CardHeader>
              <CardTitle className='text-neon-green'>{t('batch.chooseInputMethod')}</CardTitle>
              <CardDescription>{t('batch.selectMethod')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex gap-4'>
                <Button
                  variant={inputMethod === "manual" ? "default" : "outline"}
                  onClick={() => setInputMethod("manual")}
                  className='flex-1'
                >
                  <FileText className='mr-2 h-4 w-4' />
                  {t('batch.manualEntry')}
                </Button>
                <Button
                  variant={inputMethod === "csv" ? "default" : "outline"}
                  onClick={() => setInputMethod("csv")}
                  className='flex-1'
                >
                  <Upload className='mr-2 h-4 w-4' />
                  {t('batch.csvUpload')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Input Section */}
          <Card className='glass-effect border-border/50'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-neon-green'>
                {inputMethod === "manual" ? <FileText className='h-5 w-5' /> : <Upload className='h-5 w-5' />}
                {inputMethod === "manual" ? t('batch.enterUrls') : t('batch.uploadCsv')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {inputMethod === "manual" ? (
                <div className='space-y-2'>
                  <Label htmlFor='urls'>{t('batch.urlsLabel')}</Label>
                  <Textarea
                    id='urls'
                    placeholder='https://example.com&#10;https://another-site.com&#10;example.org'
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                    className='min-h-32 resize-none'
                  />
                  <p className='text-sm text-muted-foreground'>{t('batch.urlsHint')}</p>
                </div>
              ) : (
                <div className='space-y-2'>
                  <Label htmlFor='csv-file'>{t('batch.csvFileLabel')}</Label>
                  <Input id='csv-file' type='file' accept='.csv' onChange={handleFileChange} className='cursor-pointer' />
                  <p className='text-sm text-muted-foreground'>
                    {t('batch.csvFileHint')}
                  </p>
                  {csvFile && <p className='text-sm text-green-600'>{t('batch.selected')}: {csvFile.name}</p>}
                </div>
              )}

              {error && <ErrorMessage error={error} onRetry={handleGenerate} />}

              {/* QR Code Templates */}
              <QRTemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateSelect={handleTemplateSelect}
                currentColors={{
                  fg: foregroundColor,
                  bg: backgroundColor
                }}
              />

              {/* Customization Options */}
              <Card className='border-border/30 bg-card/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Palette className='h-4 w-4' />
                    {t('batch.customizationOptions')}
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='space-y-2'>
                      <Label>{t('batch.errorCorrection')}</Label>
                      <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='L'>{t('batch.errorCorrectionLow')}</SelectItem>
                          <SelectItem value='M'>{t('batch.errorCorrectionMedium')}</SelectItem>
                          <SelectItem value='Q'>{t('batch.errorCorrectionQuartile')}</SelectItem>
                          <SelectItem value='H'>{t('batch.errorCorrectionHigh')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label>{t('batch.size')}</Label>
                      <Select value={size} onValueChange={setSize}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='small'>{t('batch.sizeSmall')}</SelectItem>
                          <SelectItem value='medium'>{t('batch.sizeMedium')}</SelectItem>
                          <SelectItem value='large'>{t('batch.sizeLarge')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label>{t('batch.border')}</Label>
                      <Select value={border.toString()} onValueChange={(value) => setBorder(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='1'>{t('batch.borderThin')}</SelectItem>
                          <SelectItem value='2'>{t('batch.borderLight')}</SelectItem>
                          <SelectItem value='3'>{t('batch.borderMedium')}</SelectItem>
                          <SelectItem value='4'>{t('batch.borderThick')}</SelectItem>
                          <SelectItem value='5'>{t('batch.borderExtraThick')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label>{t('batch.qrCodeColor')}</Label>
                      <div className='flex gap-2'>
                        <input
                          type='color'
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className='w-12 h-10 rounded border'
                        />
                        <Input
                          type='text'
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className='flex-1'
                          placeholder='#000000'
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label>{t('batch.backgroundColor')}</Label>
                      <div className='flex gap-2'>
                        <input
                          type='color'
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className='w-12 h-10 rounded border'
                        />
                        <Input
                          type='text'
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className='flex-1'
                          placeholder='#ffffff'
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className='w-full h-12 text-base bg-gradient-primary hover:bg-gradient-primary/90'
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                    {t('batch.processing')}
                  </>
                ) : (
                  <>
                    {t('batch.generateBtn')}
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Progress */}
          {isLoading && (
            <Card className='glass-effect border-border/50'>
              <CardContent className='pt-6'>
                <div className='space-y-4'>
                  <div className='flex justify-between text-sm'>
                    <span>{t('batch.processing')}...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className='w-full' />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {results.length > 0 && (
            <Card className='glass-effect border-border/50'>
              <CardHeader>
                <CardTitle className='text-neon-green'>{t('batch.complete')}</CardTitle>
                <CardDescription>
                  {successfulCount} {t('batch.successCount')}, {failedCount} {t('batch.failedCount')}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {results.map((result, index) => (
                  <div key={index} className='flex items-center gap-4 p-4 border rounded-lg'>
                    {result.success ? (
                      <CheckCircle className='h-5 w-5 text-green-500 flex-shrink-0' />
                    ) : (
                      <AlertCircle className='h-5 w-5 text-red-500 flex-shrink-0' />
                    )}
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>{result.url}</p>
                      {!result.success && <p className='text-sm text-red-500'>{result.error}</p>}
                    </div>
                  </div>
                ))}

                {zipFile && (
                  <Button
                    onClick={handleDownloadZip}
                    className='w-full border-neon-green text-neon-green hover:bg-neon-green hover:text-primary-foreground'
                  >
                    <Download className='mr-2 h-4 w-4' />
                    {t('batch.downloadBtn')}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
