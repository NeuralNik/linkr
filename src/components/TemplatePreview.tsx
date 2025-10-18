import React from 'react';
import { type QRTemplate } from '@/data/qrTemplates';

interface TemplatePreviewProps {
  template: QRTemplate;
  size?: 'small' | 'medium' | 'large';
}

export function TemplatePreview({ template, size = 'medium' }: TemplatePreviewProps) {
  const sizeConfig = {
    small: { container: 'w-8 h-8', dot: 'w-1 h-1' },
    medium: { container: 'w-12 h-12', dot: 'w-1 h-1' },
    large: { container: 'w-16 h-16', dot: 'w-1 h-1' },
  };

  const { container } = sizeConfig[size];

  return (
    <div 
      className={`${container} rounded border flex items-center justify-center p-1`}
      style={{ backgroundColor: template.bg }}
    >
      <div className="grid grid-cols-6 gap-px">
        {Array.from({ length: 36 }, (_, i) => {
          const showDot = Math.random() > 0.4;
          return (
            <div
              key={i}
              className={`w-1 h-1 ${showDot ? '' : 'opacity-0'}`}
              style={{ backgroundColor: template.fg }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default TemplatePreview;