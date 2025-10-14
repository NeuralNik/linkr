import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { CheckCircle, Camera, CameraOff, Link as LinkIcon, Loader2, QrCode, ExternalLink, Clipboard, ClipboardCheck } from "lucide-react";
import jsQR from "jsqr";

export function QRScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [permissionError, setPermissionError] = useState<string>("");
  const [scannedUrl, setScannedUrl] = useState<string>("");
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8000";

  const validateUrl = (inputUrl: string): boolean => {
    try {
      new URL(inputUrl);
      return true;
    } catch {
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

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const startCamera = useCallback(async () => {
    setPermissionError("");
    setGeneratedQR("");
    setScannedUrl("");
    setIsValidUrl(false);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream as any;
        await videoRef.current.play();
      }
      setScanning(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to access camera.";
      setPermissionError(message);
      setScanning(false);
    }
  }, [videoRef, setStream]);

  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code?.data) {
      const data = code.data.trim();
      setScannedUrl(data);
      setIsValidUrl(validateUrl(data));
    }
  }, []);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      if (scanning && stream) {
        scanFrame();
        rafId = requestAnimationFrame(tick);
      }
    };
    if (scanning) rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [scanning, stream, scanFrame]);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  const handleGenerateFromScan = async () => {
    if (!scannedUrl || !isValidUrl) return;
    setGenerating(true);
    setGeneratedQR("");
    try {
      const response = await fetch(`${API_BASE_URL}/generate-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: formatUrl(scannedUrl),
          foreground_color: "#000000",
          background_color: "#ffffff",
          format: "png",
          error_correction: "H",
          size: "medium",
          border: 4,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate QR code.");
      }
      const data = await response.json();
      setGeneratedQR(data.qr_code);
    } catch (e) {
      setPermissionError(e instanceof Error ? e.message : "Failed generating QR.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!scannedUrl) return;
    await navigator.clipboard.writeText(formatUrl(scannedUrl));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neon-green">
            <QrCode className="h-5 w-5" />
            Scan QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg overflow-hidden bg-black/50 relative">
            <video ref={videoRef} className="w-full h-auto block" playsInline muted />
            {!scanning && !stream && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/80 text-sm px-4">Camera preview will appear here</div>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex flex-wrap gap-3">
            <Button onClick={startCamera} disabled={scanning} className="bg-gradient-primary hover:bg-gradient-primary/90">
              <Camera className="mr-2 h-4 w-4" />
              Start Scanning
            </Button>
            <Button onClick={() => { setScanning(false); stopStream(); }} variant="outline">
              <CameraOff className="mr-2 h-4 w-4" />
              Stop
            </Button>
          </div>

          {permissionError && (
            <Alert className='border-destructive/50 bg-destructive/10'>
              <AlertDescription>{permissionError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Scanned URL will appear here"
                value={scannedUrl}
                onChange={(e) => { setScannedUrl(e.target.value); setIsValidUrl(validateUrl(e.target.value)); }}
                className="pr-12 h-12 text-base border-border focus:border-neon-green"
              />
              <LinkIcon className='absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
            </div>
            {scannedUrl && !isValidUrl && (
              <Alert className='border-destructive/50 bg-destructive/10'>
                <AlertDescription>Scanned text is not a valid URL.</AlertDescription>
              </Alert>
            )}
            {scannedUrl && isValidUrl && (
              <Alert className='border-neon-green/50 bg-neon-green/10'>
                <CheckCircle className='h-4 w-4 text-neon-green' />
                <AlertDescription className='text-neon-green'>Valid URL detected.</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCopyUrl} variant={copied ? "default" : "outline"} disabled={!scannedUrl}>
              {copied ? <ClipboardCheck className='mr-2 h-4 w-4' /> : <Clipboard className='mr-2 h-4 w-4' />}
              {copied ? "Copied" : "Copy URL"}
            </Button>
            <a href={isValidUrl ? formatUrl(scannedUrl) : undefined} target="_blank" rel="noreferrer">
              <Button variant="outline" disabled={!isValidUrl}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open URL
              </Button>
            </a>
            <Button onClick={handleGenerateFromScan} disabled={!isValidUrl || generating} className="bg-gradient-primary hover:bg-gradient-primary/90">
              {generating ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Generating...
                </>
              ) : (
                <>
                  Generate QR
                </>
              )}
            </Button>
          </div>

          {generatedQR && (
            <div className="space-y-4">
              <div className='flex justify-center'>
                <div className='p-4 bg-white rounded-lg shadow-lg'>
                  <img src={generatedQR} alt='Generated QR' className='max-w-full h-auto' style={{ maxWidth: "256px", maxHeight: "256px" }} />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
