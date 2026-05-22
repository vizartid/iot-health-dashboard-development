'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats, getChildren, getMeasurementsForChild } from '@/lib/api';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RealtimeMonitor } from '@/components/dashboard/realtime-monitor';
import { Card } from '@/components/ui/card';
import { Users, AlertCircle, Stethoscope, Wifi } from 'lucide-react';
import { DashboardStats, Child, Measurement } from '@/types';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [measurements, setMeasurements] = useState<Record<string, Measurement>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load stats
        const statsRes = await getDashboardStats();
        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }

        // Load children
        const childrenRes = await getChildren();
        if (childrenRes.success && childrenRes.data) {
          setChildren(childrenRes.data);

          // Load latest measurements for each child
          const measurementsMap: Record<string, Measurement> = {};
          for (const child of childrenRes.data) {
            const measurementsRes = await getMeasurementsForChild(child.id);
            if (measurementsRes.success && measurementsRes.data?.[0]) {
              measurementsMap[child.id] = measurementsRes.data[0];
            }
          }
          setMeasurements(measurementsMap);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 h-32 animate-pulse bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor kesehatan balita secara real-time</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Children"
          value={stats?.totalChildren || 0}
          icon={<Users className="w-6 h-6" />}
          color="emerald"
          trend={5}
        />

        <StatsCard
          title="At Risk"
          value={stats?.childrenAtRisk || 0}
          icon={<AlertCircle className="w-6 h-6" />}
          color="red"
          trend={-2}
        />

        <StatsCard
          title="Nutritional Status"
          value={`${stats?.averageNutritionalStatus.normal || 0}`}
          unit="Normal"
          icon={<Stethoscope className="w-6 h-6" />}
          color="blue"
          trend={3}
        />

        <StatsCard
          title="Device Status"
          value={stats?.deviceStatus.online || 0}
          unit="Online"
          icon={<Wifi className="w-6 h-6" />}
          color="purple"
          trend={1}
        />
      </div>

      {/* Real-time Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* IoT Monitor */}
        <div className="lg:col-span-2">
          <RealtimeMonitor children={children} measurements={measurements} />
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 h-full">
            <h3 className="text-lg font-semibold mb-6">Nutritional Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Gizi Normal</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {stats?.averageNutritionalStatus.normal || 0}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        ((stats?.averageNutritionalStatus.normal || 0) / (stats?.totalChildren || 1)) * 100
                      }%`,
                    }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Gizi Kurang</span>
                  <span className="text-sm font-bold text-orange-600">
                    {stats?.averageNutritionalStatus.warning || 0}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        ((stats?.averageNutritionalStatus.warning || 0) / (stats?.totalChildren || 1)) * 100
                      }%`,
                    }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="h-full bg-orange-500 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Gizi Buruk</span>
                  <span className="text-sm font-bold text-red-600">
                    {stats?.averageNutritionalStatus.critical || 0}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        ((stats?.averageNutritionalStatus.critical || 0) / (stats?.totalChildren || 1)) * 100
                      }%`,
                    }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-full bg-red-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
