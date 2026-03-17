import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { qrTemplates, templateCategories } from '@/data/qrTemplates';
import { TemplatePreview } from '@/components/TemplatePreview';
import { Palette, Sparkles } from 'lucide-react';

export default function Templates() {
  const { t } = useTranslation();
  
  const getCategoryColor = (category: string) => {
    const colors = {
      business: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      creative: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      nature: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      tech: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      minimal: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[category as keyof typeof colors] || colors.minimal;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business': return '💼';
      case 'creative': return '🎨';
      case 'nature': return '🌿';
      case 'tech': return '🔧';
      case 'minimal': return '⚪';
      default: return '🎯';
    }
  };

  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            {t('templates.titleStart')} <span className="text-neon-green">{t('templates.titleEnd')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {t('templates.subtitle')}
          </p>
        </div>

        {/* Templates by Category */}
        <div className="space-y-12">
          {templateCategories.slice(1).map((category) => {
            const categoryTemplates = qrTemplates.filter(
              template => template.category === category.value
            );

            if (categoryTemplates.length === 0) return null;

            return (
              <section key={category.value} className="space-y-6">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-2xl">{getCategoryIcon(category.value)}</div>
                  <h2 className="text-2xl md:text-3xl font-bold capitalize">
                    {t(`templates.category_${category.value}`)}
                  </h2>
                  <Badge 
                    variant="secondary" 
                    className={`${getCategoryColor(category.value)}`}
                  >
                    {categoryTemplates.length} {t('templates.templates')}
                  </Badge>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryTemplates.map((template) => (
                    <Card 
                      key={template.id}
                      className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/30 bg-card/50"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold">
                            {template.name}
                          </CardTitle>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getCategoryColor(template.category)}`}
                          >
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Large Preview */}
                        <div className="flex justify-center py-4">
                          <TemplatePreview template={template} size="large" />
                        </div>

                        {/* Color Information */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Foreground:</span>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: template.fg }}
                              />
                              <code className="font-mono bg-muted px-1 rounded">
                                {template.fg}
                              </code>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Background:</span>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: template.bg }}
                              />
                              <code className="font-mono bg-muted px-1 rounded">
                                {template.bg}
                              </code>
                            </div>
                          </div>
                        </div>

                        {/* Usage Suggestion */}
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground">
                            {category.value === 'business' && t('templates.usageBusiness')}
                            {category.value === 'creative' && t('templates.usageCreative')}
                            {category.value === 'nature' && t('templates.usageNature')}
                            {category.value === 'tech' && t('templates.usageTech')}
                            {category.value === 'minimal' && t('templates.usageMinimal')}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto glass-effect border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-neon-green" />
                <span className="text-lg font-semibold">{t('templates.readyToCreate')}</span>
                <Sparkles className="h-5 w-5 text-neon-green" />
              </div>
              <p className="text-muted-foreground mb-6">
                {t('templates.ctaDesc')}
              </p>
              <div className="flex gap-3 justify-center">
                <a 
                  href="/" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-300 hover:glow-effect"
                >
                  <Palette className="mr-2 h-4 w-4" />
                  {t('templates.startCreating')}
                </a>
                <a 
                  href="/batch" 
                  className="inline-flex items-center px-6 py-3 border border-neon-green text-neon-green hover:bg-neon-green hover:text-primary-foreground rounded-lg font-medium transition-all duration-300"
                >
                  {t('templates.batchGenerate')}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}