import { ResponsiveContainer, BarChart as RBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function BarChart({ data, xKey = 'x', yKey = 'y', color = '#10b981' }: { data: any[]; xKey?: string; yKey?: string; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RBarChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey={yKey} fill={color} />
      </RBarChart>
    </ResponsiveContainer>
  );
}
