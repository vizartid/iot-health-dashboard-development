'use client';

import { useEffect, useState } from 'react';
import { getChildren, getMeasurementsForChild } from '@/lib/api';
import { ChildrenTable } from '@/components/dashboard/children-table';
import { Child, Measurement } from '@/types';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [measurements, setMeasurements] = useState<Record<string, Measurement>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
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
        <Card className="p-6 h-96 animate-pulse bg-muted" />
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
        <h1 className="text-3xl font-bold text-foreground">Children Management</h1>
        <p className="text-muted-foreground mt-1">Kelola data kesehatan seluruh balita</p>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ChildrenTable children={children} measurements={measurements} />
      </motion.div>
    </div>
  );
}
