import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function Analytics() {
  const [anonymize, setAnonymize] = useState(false);
  const qc = useQueryClient();

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['analytics', 'stats', anonymize],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/analytics/stats?anonymize=${anonymize ? 'true' : 'false'}`);
      if (!res.ok) throw new Error('Failed to load stats');
      return res.json();
    },
  });

  const { data: dailyGen } = useQuery({
    queryKey: ['analytics', 'daily', 'generate'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/analytics/daily?action=generate`);
      if (!res.ok) throw new Error('Failed to load daily');
      return res.json();
    },
  });

  const { data: dailyScan } = useQuery({
    queryKey: ['analytics', 'daily', 'scan'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/analytics/daily?action=scan`);
      if (!res.ok) throw new Error('Failed to load daily');
      return res.json();
    },
  });

  useEffect(() => {
    const ws = new WebSocket((API_BASE_URL.replace('http', 'ws') + '/ws/analytics').replace('https', 'wss'));
    ws.onmessage = () => {
      qc.invalidateQueries({ queryKey: ['analytics'] });
    };
    ws.onopen = () => {
      try { ws.send('ping'); } catch {}
    };
    return () => { try { ws.close(); } catch {} };
  }, [qc]);

  const dailyGenSeries = useMemo(() => (dailyGen || []).map((d: any) => ({ x: d.date, y: d.count })), [dailyGen]);
  const dailyScanSeries = useMemo(() => (dailyScan || []).map((d: any) => ({ x: d.date, y: d.count })), [dailyScan]);
  const topUrlPie = useMemo(() => (stats?.top_urls || []).map((t: any) => ({ name: t.url || 'unknown', value: t.count })), [stats]);
  const topUrlTable = useMemo(() => (stats?.top_urls || []).slice(0, 10), [stats]);

  const handleExport = async (fmt: 'json' | 'csv') => {
    const url = `${API_BASE_URL}/api/analytics/export?format=${fmt}&anonymize=${anonymize ? 'true' : 'false'}`;
    const res = await fetch(url);
    if (!res.ok) return;
    if (fmt === 'json') {
      const blob = new Blob([JSON.stringify(await res.json(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'analytics.json';
      a.click();
    } else {
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'analytics.csv';
      a.click();
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-4 space-y-6'>
      <div className='flex items-center justify-between gap-4'>
        <h1 className='text-2xl font-semibold'>Analytics Dashboard</h1>
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-2'>
            <Switch checked={anonymize} onCheckedChange={setAnonymize} />
            <Label>Privacy mode</Label>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' onClick={() => handleExport('json')}>Export JSON</Button>
            <Button onClick={() => handleExport('csv')}>Export CSV</Button>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{stats?.total_events ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{stats?.total_generated ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{stats?.total_scans ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>QR Generations per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={dailyGenSeries} xKey='x' yKey='y' color='#4f46e5' />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>QR Scans per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={dailyScanSeries} xKey='x' yKey='y' color='#10b981' />
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Popular URLs</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={topUrlPie} dataKey='value' nameKey='name' />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-sm'>Average response time</div>
            <div className='text-3xl font-bold'>{stats?.avg_response_time?.toFixed ? stats.avg_response_time.toFixed(2) : (stats?.avg_response_time ?? 0)} ms</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing URLs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(topUrlTable || []).map((row: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell className='truncate max-w-[400px]'>{row.url || 'unknown'}</TableCell>
                  <TableCell>{row.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
