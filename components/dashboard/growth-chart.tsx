'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Measurement } from '@/types';

interface GrowthChartProps {
  measurements: Measurement[];
  title: string;
  type: 'weight' | 'height';
}

export function GrowthChart({ measurements, title, type }: GrowthChartProps) {
  const data = measurements
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((m) => ({
      date: new Date(m.timestamp).toLocaleDateString('id-ID', {
        month: 'short',
        day: 'numeric',
      }),
      value: type === 'weight' ? m.weight : m.height,
      timestamp: m.timestamp,
    }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="date"
            stroke="var(--color-muted-foreground)"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="var(--color-muted-foreground)"
            style={{ fontSize: '12px' }}
            label={{ value: type === 'weight' ? 'kg' : 'cm', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: `1px solid var(--color-border)`,
              borderRadius: '8px',
            }}
            cursor={{ stroke: 'var(--color-primary)' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-primary)"
            strokeWidth={3}
            dot={{ fill: 'var(--color-primary)', r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
