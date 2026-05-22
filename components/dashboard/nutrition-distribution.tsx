'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

interface NutritionDistributionProps {
  normal: number;
  warning: number;
  critical: number;
}

const COLORS = {
  normal: 'var(--color-primary)', // emerald
  warning: '#f97316', // orange
  critical: '#ef4444', // red
};

export function NutritionDistributionChart({ normal, warning, critical }: NutritionDistributionProps) {
  const data = [
    { name: 'Gizi Normal', value: normal, fill: COLORS.normal },
    { name: 'Gizi Kurang', value: warning, fill: COLORS.warning },
    { name: 'Gizi Buruk', value: critical, fill: COLORS.critical },
  ];

  const total = normal + warning + critical;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Nutritional Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: `1px solid var(--color-border)`,
              borderRadius: '8px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-sm text-foreground">{item.name}</span>
            </div>
            <span className="font-semibold text-foreground">
              {item.value} ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
