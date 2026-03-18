import { useState } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Palette, FullScreen, Minimize } from 'lucide-react';

export default function Draw() {
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
            Digital Drawing Canvas
          </h1>
          <p className="text-gray-600">
            Create beautiful drawings with our responsive drawing tools
          </p>
        </div>

        {/* Controls */}
        {!isFullscreen && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Canvas Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Label htmlFor="canvas-size">Canvas Size:</Label>
                  <Select value={canvasSize} onValueChange={setCanvasSize}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (600×400)</SelectItem>
                      <SelectItem value="medium">Medium (800×600)</SelectItem>
                      <SelectItem value="large">Large (1200×800)</SelectItem>
                      <SelectItem value="xl">Extra Large (1600×900)</SelectItem>
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
                  Fullscreen
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
            Exit Fullscreen
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
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Drawing Tools:</h4>
                  <ul className="space-y-1">
                    <li>• <strong>Pencil:</strong> Fine, precise lines</li>
                    <li>• <strong>Brush:</strong> Smooth, natural strokes</li>
                    <li>• <strong>Eraser:</strong> Remove parts of your drawing</li>
                    <li>• <strong>Fill:</strong> Fill entire canvas with selected color</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Controls:</h4>
                  <ul className="space-y-1">
                    <li>• <strong>Mouse:</strong> Click and drag to draw</li>
                    <li>• <strong>Touch:</strong> Touch and drag on mobile devices</li>
                    <li>• <strong>Undo/Redo:</strong> Navigate through your drawing history</li>
                    <li>• <strong>Download:</strong> Save your artwork as PNG</li>
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