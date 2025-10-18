import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { qrTemplates, templateCategories, type QRTemplate } from '@/data/qrTemplates';

interface QRTemplateSelectorTestProps {
  onTemplateSelect?: (template: QRTemplate) => void;
}

export function QRTemplateSelectorTest({ onTemplateSelect }: QRTemplateSelectorTestProps) {
  const handleTemplateSelect = (template: QRTemplate) => {
    onTemplateSelect?.(template);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg text-glow flex items-center gap-2">
          QR Code Templates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {qrTemplates.slice(0, 6).map((template) => (
            <Card 
              key={template.id}
              className="cursor-pointer hover:ring-2 hover:ring-neon-green transition-all duration-200 glass-card-hover"
              onClick={() => handleTemplateSelect(template)}
            >
              <CardContent className="p-3 space-y-2">
                <Badge variant="secondary" className="text-xs">
                  {template.category}
                </Badge>
                
                <h4 className="font-medium text-sm">{template.name}</h4>
                <p className="text-xs text-muted-foreground">{template.description}</p>
                
                {/* Simple Color Preview */}
                <div className="relative w-full h-12 rounded-md border overflow-hidden">
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: template.bg }}
                  >
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: template.fg }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Showing 6 of {qrTemplates.length} templates. Visit Templates page to see all.
        </p>
      </CardContent>
    </Card>
  );
}