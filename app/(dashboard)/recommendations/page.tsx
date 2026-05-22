'use client';

import { useEffect, useState } from 'react';
import { getChildren, getMeasurementsForChild, analyzeChildHealth } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Child, Measurement, HealthStatus } from '@/types';
import { motion } from 'framer-motion';
import { AlertCircle, Heart, Lightbulb } from 'lucide-react';

interface ChildWithHealth extends Child {
  measurement?: Measurement;
  health?: HealthStatus;
  recommendations?: string[];
}

export default function RecommendationsPage() {
  const [children, setChildren] = useState<ChildWithHealth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const childrenRes = await getChildren();
        if (childrenRes.success && childrenRes.data) {
          const childrenWithHealth: ChildWithHealth[] = [];

          for (const child of childrenRes.data) {
            const measurementsRes = await getMeasurementsForChild(child.id);
            const healthRes = await analyzeChildHealth(child.id);

            childrenWithHealth.push({
              ...child,
              measurement: measurementsRes.success ? measurementsRes.data?.[0] : undefined,
              health: healthRes.success ? healthRes.data?.healthStatus : undefined,
              recommendations: healthRes.success ? healthRes.data?.recommendations : [],
            });
          }

          // Sort by health status priority
          childrenWithHealth.sort((a, b) => {
            const priority = { 'gizi-buruk': 0, 'gizi-kurang': 1, 'gizi-normal': 2, 'gizi-lebih': 3 };
            const priorityA = a.health ? priority[a.health.status] : 4;
            const priorityB = b.health ? priority[b.health.status] : 4;
            return priorityA - priorityB;
          });

          setChildren(childrenWithHealth);
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
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 h-48 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  const criticalChildren = children.filter((c) => c.health?.status === 'gizi-buruk');
  const warningChildren = children.filter((c) => c.health?.status === 'gizi-kurang');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground">Health Recommendations</h1>
        <p className="text-muted-foreground mt-1">Personalized recommendations for each child</p>
      </motion.div>

      {/* Critical Cases */}
      {criticalChildren.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold text-red-600">Critical Cases (Immediate Attention)</h2>
          </div>

          <div className="space-y-4">
            {criticalChildren.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="p-6 border-l-4 border-l-red-600">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{child.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Status: <span className="font-semibold text-red-600">{child.health?.description}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">BMI</p>
                      <p className="text-2xl font-bold text-red-600">{child.health?.bmi}</p>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3">Priority Actions:</p>
                    <ul className="space-y-2">
                      {child.recommendations?.slice(0, 3).map((rec, i) => (
                        <li key={i} className="text-sm text-red-600 dark:text-red-400 flex gap-2">
                          <span>•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Warning Cases */}
      {warningChildren.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-orange-600">Monitoring Required (Gizi Kurang)</h2>
          </div>

          <div className="space-y-4">
            {warningChildren.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="p-6 border-l-4 border-l-orange-600">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{child.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Status: <span className="font-semibold text-orange-600">{child.health?.description}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">BMI</p>
                      <p className="text-2xl font-bold text-orange-600">{child.health?.bmi}</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-3">Recommendations:</p>
                    <ul className="space-y-2">
                      {child.recommendations?.map((rec, i) => (
                        <li key={i} className="text-sm text-orange-600 dark:text-orange-400 flex gap-2">
                          <span>•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Healthy Children Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-semibold text-emerald-600">
            Healthy Children ({children.filter((c) => c.health?.status === 'gizi-normal').length})
          </h2>
        </div>

        <Card className="p-6 border-l-4 border-l-emerald-600">
          <p className="text-sm text-muted-foreground mb-4">
            These children are maintaining normal nutritional status. Continue regular monitoring and healthy feeding practices.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {children
              .filter((c) => c.health?.status === 'gizi-normal')
              .map((child) => (
                <div key={child.id} className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <p className="font-medium text-foreground">{child.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">BMI: {child.health?.bmi}</p>
                </div>
              ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
