export interface QRTemplate {
  id: string;
  name: string;
  description: string;
  fg: string; // foreground color
  bg: string; // background color
  category: 'business' | 'creative' | 'nature' | 'tech' | 'minimal';
  preview?: string;
}

export const qrTemplates: QRTemplate[] = [
  // Business Templates
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and corporate look',
    fg: '#2563eb',
    bg: '#f8fafc',
    category: 'business',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Dark professional theme',
    fg: '#1f2937',
    bg: '#ffffff',
    category: 'business',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium business style',
    fg: '#374151',
    bg: '#f3f4f6',
    category: 'business',
  },

  // Creative Templates
  {
    id: 'neon',
    name: 'Neon',
    description: 'Vibrant cyber look',
    fg: '#00ff41',
    bg: '#000000',
    category: 'creative',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm evening colors',
    fg: '#f97316',
    bg: '#fef3c7',
    category: 'creative',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark and mysterious',
    fg: '#8b5cf6',
    bg: '#0f0f23',
    category: 'creative',
  },
  {
    id: 'fire',
    name: 'Fire',
    description: 'Bold red energy',
    fg: '#dc2626',
    bg: '#fef2f2',
    category: 'creative',
  },

  // Nature Templates
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Calm blue waters',
    fg: '#0ea5e9',
    bg: '#e0f2fe',
    category: 'nature',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural green theme',
    fg: '#16a34a',
    bg: '#f0fdf4',
    category: 'nature',
  },
  {
    id: 'earth',
    name: 'Earth',
    description: 'Earthy brown tones',
    fg: '#92400e',
    bg: '#fefbf3',
    category: 'nature',
  },

  // Tech Templates
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Green code aesthetic',
    fg: '#22c55e',
    bg: '#001100',
    category: 'tech',
  },
  {
    id: 'cyber',
    name: 'Cyber',
    description: 'Futuristic blue glow',
    fg: '#06b6d4',
    bg: '#0c1925',
    category: 'tech',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Classic console look',
    fg: '#84cc16',
    bg: '#171717',
    category: 'tech',
  },

  // Minimal Templates
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    description: 'Clean and simple',
    fg: '#000000',
    bg: '#ffffff',
    category: 'minimal',
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    description: 'Simple dark theme',
    fg: '#ffffff',
    bg: '#000000',
    category: 'minimal',
  },
];

export const getTemplatesByCategory = (category: QRTemplate['category']) => {
  return qrTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return qrTemplates.find(template => template.id === id);
};

export const templateCategories = [
  { value: 'all', label: 'All Templates' },
  { value: 'business', label: 'Business' },
  { value: 'creative', label: 'Creative' },
  { value: 'nature', label: 'Nature' },
  { value: 'tech', label: 'Tech' },
  { value: 'minimal', label: 'Minimal' },
] as const;