import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DrawingCanvas from '@/components/DrawingCanvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Palette, FullScreen, Minimize } from 'lucide-react';

export default function Draw() {
  const { t } = useTranslation();
  const [canvasSize, setCanvasSize] = useState('large');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getSizeDimensions = (size: string) => {
    switch (size) {
      case 'small':
        return { width: 600, height: 400 };
      case 'medium':
        return { width: 800, height: 600 };
      case 'large':
        return { width: 1200, height: 800 };
      case 'xl':
        return { width: 1600, height: 900 };
      default:
        return { width: 800, height: 600 };
    }
  };

  const { width, height } = getSizeDimensions(canvasSize);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {t('draw.title')}
          </h1>
          <p className="text-gray-600">
            {t('draw.subtitle')}
          </p>
        </div>

        {/* Controls */}
        {!isFullscreen && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {t('draw.canvasSettings')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Label htmlFor="canvas-size">{t('draw.canvasSize')}:</Label>
                  <Select value={canvasSize} onValueChange={setCanvasSize}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">{t('draw.sizeSmall')}</SelectItem>
                      <SelectItem value="medium">{t('draw.sizeMedium')}</SelectItem>
                      <SelectItem value="large">{t('draw.sizeLarge')}</SelectItem>
                      <SelectItem value="xl">{t('draw.sizeXL')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="flex items-center gap-2"
                >
                  <FullScreen className="h-4 w-4" />
                  {t('draw.fullscreen')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fullscreen Exit Button */}
        {isFullscreen && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white"
          >
            <Minimize className="h-4 w-4" />
            {t('draw.exitFullscreen')}
          </Button>
        )}

        {/* Drawing Canvas */}
        <DrawingCanvas 
          width={width} 
          height={height}
          className={isFullscreen ? 'h-screen flex flex-col' : ''}
        />

        {/* Instructions */}
        {!isFullscreen && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('draw.howToUse')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('draw.drawingTools')}:</h4>
                  <ul className="space-y-1">
                    <li>• <strong>{t('draw.pencil')}:</strong> {t('draw.pencilDesc')}</li>
                    <li>• <strong>{t('draw.brush')}:</strong> {t('draw.brushDesc')}</li>
                    <li>• <strong>{t('draw.eraser')}:</strong> {t('draw.eraserDesc')}</li>
                    <li>• <strong>{t('draw.fill')}:</strong> {t('draw.fillDesc')}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('draw.controls')}:</h4>
                  <ul className="space-y-1">
                    <li>• <strong>{t('draw.mouse')}:</strong> {t('draw.mouseDesc')}</li>
                    <li>• <strong>{t('draw.touch')}:</strong> {t('draw.touchDesc')}</li>
                    <li>• <strong>{t('draw.undoRedo')}:</strong> {t('draw.undoRedoDesc')}</li>
                    <li>• <strong>{t('draw.download')}:</strong> {t('draw.downloadDesc')}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}