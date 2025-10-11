import { ResponsiveContainer, LineChart as RLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export type LinePoint = { x: string | number; y: number };

export default function LineChart({ data, xKey = 'x', yKey = 'y', color = '#4f46e5' }: { data: any[]; xKey?: string; yKey?: string; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RLineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} dot={false} />
      </RLineChart>
    </ResponsiveContainer>
  );
}
