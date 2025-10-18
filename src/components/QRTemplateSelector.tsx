import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Check } from 'lucide-react';
import { qrTemplates, templateCategories, getTemplatesByCategory, type QRTemplate } from '@/data/qrTemplates';

interface QRTemplateSelectorProps {
  selectedTemplate: string | null;
  onTemplateSelect: (template: QRTemplate) => void;
  currentColors: { fg: string; bg: string };
}

export function QRTemplateSelector({ 
  selectedTemplate, 
  onTemplateSelect, 
  currentColors 
}: QRTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  
  const filteredTemplates = selectedCategory === 'all' 
    ? qrTemplates 
    : getTemplatesByCategory(selectedCategory as QRTemplate['category']);

  const getCategoryColor = (category: QRTemplate['category']) => {
    const colors = {
      business: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      creative: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      nature: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      tech: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      minimal: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[category];
  };

  const isCurrentTemplate = (template: QRTemplate) => {
    return currentColors.fg === template.fg && currentColors.bg === template.bg;
  };

  return (
    <Card className="border-border/30 bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
          <Palette className="h-4 w-4" />
          QR Code Templates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Filter by Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="border-border focus:border-neon-green">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templateCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                isCurrentTemplate(template)
                  ? 'ring-2 ring-neon-green border-neon-green'
                  : 'hover:border-neon-green/50'
              }`}
              onClick={() => onTemplateSelect(template)}
            >
              <CardContent className="p-3 space-y-2">
                {/* Color Preview */}
                <div className="relative w-full h-16 rounded-md border overflow-hidden">
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: template.bg }}
                  >
                    <div 
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: template.fg }}
                    />
                  </div>
                  
                  {/* Selected Indicator */}
                  {isCurrentTemplate(template) && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-neon-green rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">{template.name}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getCategoryColor(template.category)}`}
                    >
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                  
                  {/* Color Values */}
                  <div className="flex gap-1 text-xs">
                    <div className="flex items-center gap-1">
                      <div 
                        className="w-2 h-2 rounded-full border"
                        style={{ backgroundColor: template.fg }}
                      />
                      <span className="text-muted-foreground font-mono">
                        {template.fg.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const randomTemplate = filteredTemplates[Math.floor(Math.random() * filteredTemplates.length)];
              onTemplateSelect(randomTemplate);
            }}
            className="flex-1"
          >
            Random Template
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTemplateSelect({ 
              id: 'custom', 
              name: 'Custom', 
              description: 'Custom colors', 
              fg: '#000000', 
              bg: '#ffffff', 
              category: 'minimal' 
            })}
            className="flex-1"
          >
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}