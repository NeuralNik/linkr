import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  Search, 
  Download, 
  Copy, 
  Trash2, 
  Calendar,
  ExternalLink,
  Filter,
  RotateCcw
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

export interface QRHistoryItem {
  id: string;
  url: string;
  foregroundColor: string;
  backgroundColor: string;
  format: string;
  size: string;
  errorCorrection: string;
  timestamp: number;
  qrCodeData?: string;
  templateName?: string;
}

interface QRHistoryCardProps {
  qr: QRHistoryItem;
  onDelete: (id: string) => void;
  onRegenerate: (qr: QRHistoryItem) => void;
}

const QRHistoryCard: React.FC<QRHistoryCardProps> = ({ qr, onDelete, onRegenerate }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(qr.url);
    toast.success('URL copied to clipboard!');
  };

  const openUrl = () => {
    window.open(qr.url, '_blank');
  };

  const downloadQR = () => {
    if (qr.qrCodeData) {
      const link = document.createElement('a');
      link.href = qr.qrCodeData;
      link.download = `qr-${qr.id}.${qr.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded!');
    }
  };

  return (
    <Card className="glass-card hover:glass-card-hover transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {qr.templateName || 'Custom'}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(qr.timestamp)}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* QR Code Preview */}
        <div className="relative">
          {qr.qrCodeData ? (
            <img 
              src={qr.qrCodeData} 
              alt="QR Code"
              className="w-full h-32 object-contain rounded-md border-2 border-border/30"
            />
          ) : (
            <div 
              className="w-full h-32 rounded-md border-2 border-dashed border-border/30 flex items-center justify-center"
              style={{ backgroundColor: qr.backgroundColor }}
            >
              <div 
                className="w-8 h-8 rounded"
                style={{ backgroundColor: qr.foregroundColor }}
              />
            </div>
          )}
        </div>

        {/* URL Display */}
        <div className="space-y-2">
          <p className="text-sm font-medium truncate" title={qr.url}>
            {qr.url}
          </p>
          <div className="flex gap-1 text-xs text-muted-foreground">
            <span>{qr.format.toUpperCase()}</span>
            <span>•</span>
            <span>{qr.size}</span>
            <span>•</span>
            <span>EC:{qr.errorCorrection}</span>
          </div>
        </div>

        {/* Color Preview */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div 
              className="w-4 h-4 rounded border border-border/30"
              style={{ backgroundColor: qr.foregroundColor }}
              title={`Foreground: ${qr.foregroundColor}`}
            />
            <div 
              className="w-4 h-4 rounded border border-border/30"
              style={{ backgroundColor: qr.backgroundColor }}
              title={`Background: ${qr.backgroundColor}`}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyUrl}
            className="flex-1"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={openUrl}
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
          
          {qr.qrCodeData && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadQR}
            >
              <Download className="w-3 h-3" />
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onRegenerate(qr)}
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(qr.id)}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const QRHistory: React.FC = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useLocalStorage<QRHistoryItem[]>('qr-history', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'url'>('newest');

  const filteredHistory = React.useMemo(() => {
    let filtered = history.filter(qr =>
      qr.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (qr.templateName && qr.templateName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => b.timestamp - a.timestamp);
      case 'oldest':
        return filtered.sort((a, b) => a.timestamp - b.timestamp);
      case 'url':
        return filtered.sort((a, b) => a.url.localeCompare(b.url));
      default:
        return filtered;
    }
  }, [history, searchTerm, sortBy]);

  const deleteQR = (id: string) => {
    setHistory(prev => prev.filter(qr => qr.id !== id));
    toast.success('QR code removed from history');
  };

  const clearAllHistory = () => {
    setHistory([]);
    toast.success('History cleared');
  };

  const onRegenerate = (qr: QRHistoryItem) => {
    // This would trigger the main QR generator with the stored settings
    // For now, we'll just show a toast
    toast.info('Regenerating QR code with saved settings...');
    // In a real implementation, you'd dispatch an action or call a callback
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `linkr-qr-history-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('History exported!');
  };

  if (history.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <History className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">{t('history.noCodesYet')}</h3>
          <p className="text-muted-foreground mb-4">
            {t('history.noCodesDesc')}
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            {t('history.generateFirst')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-glow">{t('history.title')}</h2>
          <p className="text-muted-foreground">
            {history.length} QR code{history.length !== 1 ? 's' : ''} {t('common.generated')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportHistory}>
            <Download className="w-4 h-4 mr-2" />
            {t('history.export')}
          </Button>
          <Button 
            variant="outline" 
            onClick={clearAllHistory}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('history.clearAll')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('history.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-background border border-border rounded-md px-3 py-2 text-sm"
              >
                <option value="newest">{t('history.sortNewest')}</option>
                <option value="oldest">{t('history.sortOldest')}</option>
                <option value="url">{t('history.sortURL')}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredHistory.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Search className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('history.noResults')}</h3>
            <p className="text-muted-foreground">
              {t('history.noCodesDesc')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHistory.map(qr => (
            <QRHistoryCard 
              key={qr.id} 
              qr={qr} 
              onDelete={deleteQR}
              onRegenerate={onRegenerate}
            />
          ))}
        </div>
      )}
    </div>
  );
};