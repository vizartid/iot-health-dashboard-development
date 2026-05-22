'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/lib/api';
import { NutritionDistributionChart } from '@/components/dashboard/nutrition-distribution';
import { GrowthChart } from '@/components/dashboard/growth-chart';
import { MOCK_MEASUREMENTS, MOCK_CHILDREN } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { DashboardStats } from '@/types';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const statsRes = await getDashboardStats();
        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded-lg w-64 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 h-80 animate-pulse bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  // Prepare data for trend analysis
  const trendData = [
    { month: 'Jan', normalCount: 12, warningCount: 2, criticalCount: 1 },
    { month: 'Feb', normalCount: 13, warningCount: 2, criticalCount: 0 },
    { month: 'Mar', normalCount: 14, warningCount: 1, criticalCount: 0 },
    { month: 'Apr', normalCount: 13, warningCount: 2, criticalCount: 1 },
    { month: 'May', normalCount: 15, warningCount: 1, criticalCount: 0 },
    { month: 'Jun', normalCount: 15, warningCount: 1, criticalCount: 0 },
  ];

  // Get a sample child with measurements for the chart
  const sampleChildMeasurements = MOCK_MEASUREMENTS.filter((m) => m.childId === 'child-1');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Lihat tren dan analisis kesehatan balita</p>
      </motion.div>

      {/* Nutrition Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <NutritionDistributionChart
          normal={stats?.averageNutritionalStatus.normal || 0}
          warning={stats?.averageNutritionalStatus.warning || 0}
          critical={stats?.averageNutritionalStatus.critical || 0}
        />
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart - Weight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GrowthChart measurements={sampleChildMeasurements} title="Weight Growth Tracking" type="weight" />
        </motion.div>

        {/* Growth Chart - Height */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GrowthChart measurements={sampleChildMeasurements} title="Height Growth Tracking" type="height" />
        </motion.div>
      </div>

      {/* Trend Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Nutritional Status Trends</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: `1px solid var(--color-border)`,
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="normalCount" fill="var(--color-primary)" name="Gizi Normal" radius={[8, 8, 0, 0]} />
              <Bar dataKey="warningCount" fill="#f97316" name="Gizi Kurang" radius={[8, 8, 0, 0]} />
              <Bar dataKey="criticalCount" fill="#ef4444" name="Gizi Buruk" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Improvement Rate</h4>
            <p className="text-3xl font-bold text-emerald-600">+12.5%</p>
            <p className="text-xs text-muted-foreground mt-2">Compared to last month</p>
          </Card>

          <Card className="p-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">At-Risk Children</h4>
            <p className="text-3xl font-bold text-red-600">{stats?.childrenAtRisk || 0}</p>
            <p className="text-xs text-muted-foreground mt-2">Need immediate attention</p>
          </Card>

          <Card className="p-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Healthy Children</h4>
            <p className="text-3xl font-bold text-blue-600">{stats?.averageNutritionalStatus.normal || 0}</p>
            <p className="text-xs text-muted-foreground mt-2">Maintaining normal status</p>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
