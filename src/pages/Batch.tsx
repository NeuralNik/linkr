import { ArrowRight, Upload, FileText, Loader2, CheckCircle, AlertCircle, Download, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useState } from "react";

interface BatchResult {
  url: string;
  success: boolean;
  error?: string;
  qr_code?: string;
}

export default function Batch() {
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
        setError("Please enter at least one URL.");
        return;
      }
      urlList = urls.split("\n").filter((url) => url.trim());
    } else {
      if (!csvFile) {
        setError("Please select a CSV file.");
        return;
      }
    }

    if (inputMethod === "manual") {
      const { valid, invalid } = validateUrls(urlList);
      if (valid.length === 0) {
        setError("Please enter at least one valid URL.");
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
      let response;

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
      setError("Please select a valid CSV file.");
      setCsvFile(null);
    }
  };

  const successfulCount = results.filter((r) => r.success).length;
  const failedCount = results.filter((r) => !r.success).length;

  return (
    <main className='min-h-screen py-20'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center space-y-4 mb-16 max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold leading-tight'>
            Generate <span className='text-neon-green'>Batch QR Codes</span>
          </h1>

          <p className='text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto'>
            Upload a CSV file or enter multiple URLs to generate QR codes in bulk.
          </p>
        </div>

        <div className='max-w-4xl mx-auto space-y-8'>
          {/* Input Method Selection */}
          <Card className='glass-effect border-border/50'>
            <CardHeader>
              <CardTitle className='text-neon-green'>Choose Input Method</CardTitle>
              <CardDescription>Select how you want to provide the URLs for batch generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex gap-4'>
                <Button
                  variant={inputMethod === "manual" ? "default" : "outline"}
                  onClick={() => setInputMethod("manual")}
                  className='flex-1'
                >
                  <FileText className='mr-2 h-4 w-4' />
                  Manual Entry
                </Button>
                <Button
                  variant={inputMethod === "csv" ? "default" : "outline"}
                  onClick={() => setInputMethod("csv")}
                  className='flex-1'
                >
                  <Upload className='mr-2 h-4 w-4' />
                  CSV Upload
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Input Section */}
          <Card className='glass-effect border-border/50'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-neon-green'>
                {inputMethod === "manual" ? <FileText className='h-5 w-5' /> : <Upload className='h-5 w-5' />}
                {inputMethod === "manual" ? "Enter URLs" : "Upload CSV File"}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {inputMethod === "manual" ? (
                <div className='space-y-2'>
                  <Label htmlFor='urls'>URLs (one per line)</Label>
                  <Textarea
                    id='urls'
                    placeholder='https://example.com&#10;https://another-site.com&#10;example.org'
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                    className='min-h-32 resize-none'
                  />
                  <p className='text-sm text-muted-foreground'>Enter one URL per line. Invalid URLs will be skipped.</p>
                </div>
              ) : (
                <div className='space-y-2'>
                  <Label htmlFor='csv-file'>CSV File</Label>
                  <Input id='csv-file' type='file' accept='.csv' onChange={handleFileChange} className='cursor-pointer' />
                  <p className='text-sm text-muted-foreground'>
                    Upload a CSV file with URLs in the first column. One URL per row.
                  </p>
                  {csvFile && <p className='text-sm text-green-600'>Selected: {csvFile.name}</p>}
                </div>
              )}

              {error && <ErrorMessage error={error} onRetry={handleGenerate} />}

              {/* Customization Options */}
              <Card className='border-border/30 bg-card/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Palette className='h-4 w-4' />
                    Customization Options
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='space-y-2'>
                      <Label>Error Correction</Label>
                      <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='L'>Low (L)</SelectItem>
                          <SelectItem value='M'>Medium (M)</SelectItem>
                          <SelectItem value='Q'>Quartile (Q)</SelectItem>
                          <SelectItem value='H'>High (H)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label>Size</Label>
                      <Select value={size} onValueChange={setSize}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='small'>Small</SelectItem>
                          <SelectItem value='medium'>Medium</SelectItem>
                          <SelectItem value='large'>Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label>Border Thickness</Label>
                      <Select value={border.toString()} onValueChange={(value) => setBorder(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
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

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label>QR Code Color</Label>
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
                      <Label>Background Color</Label>
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
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Batch QR Codes
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
                    <span>Generating QR codes...</span>
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
                <CardTitle className='text-neon-green'>Generation Results</CardTitle>
                <CardDescription>
                  {successfulCount} successful, {failedCount} failed
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
                    Download All as ZIP
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
