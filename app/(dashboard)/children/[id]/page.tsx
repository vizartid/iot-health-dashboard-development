'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getChildById, getMeasurementsForChild, analyzeChildHealth } from '@/lib/api';
import { GrowthChart } from '@/components/dashboard/growth-chart';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Child, Measurement, HealthStatus } from '@/types';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { getAgeInMonths } from '@/lib/mock-data';

export default function ChildDetailPage() {
  const params = useParams();
  const router = useRouter();
  const childId = params.id as string;

  const [child, setChild] = useState<Child | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load child data
        const childRes = await getChildById(childId);
        if (childRes.success && childRes.data) {
          setChild(childRes.data);
        }

        // Load measurements
        const measurementsRes = await getMeasurementsForChild(childId);
        if (measurementsRes.success && measurementsRes.data) {
          setMeasurements(measurementsRes.data);
        }

        // Load health analysis
        const healthRes = await analyzeChildHealth(childId);
        if (healthRes.success && healthRes.data) {
          setHealthStatus(healthRes.data.healthStatus);
          setRecommendations(healthRes.data.recommendations);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [childId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded-lg w-64 animate-pulse" />
        <Card className="p-6 h-96 animate-pulse bg-muted" />
      </div>
    );
  }

  if (!child || !healthStatus) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Child not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const ageMonths = getAgeInMonths(child.dateOfBirth);
  const latestMeasurement = measurements[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{child.name}</h1>
          <p className="text-muted-foreground mt-1">
            {ageMonths} months old • {child.gender === 'male' ? 'Boy' : 'Girl'}
          </p>
        </div>
      </motion.div>

      {/* Child Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Latest Measurements */}
            {latestMeasurement && (
              <>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-6 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Height</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{latestMeasurement.height}</p>
                  <p className="text-xs text-muted-foreground mt-2">cm</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 p-6 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Weight</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{latestMeasurement.weight}</p>
                  <p className="text-xs text-muted-foreground mt-2">kg</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 p-6 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">BMI</p>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{healthStatus.bmi}</p>
                  <p className="text-xs text-muted-foreground mt-2">kg/m²</p>
                </div>
              </>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Health Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: healthStatus.colorCode + '20' }}
            >
              {healthStatus.status === 'gizi-buruk' ? (
                <AlertCircle
                  className="w-6 h-6"
                  style={{ color: healthStatus.colorCode }}
                />
              ) : (
                <CheckCircle
                  className="w-6 h-6"
                  style={{ color: healthStatus.colorCode }}
                />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{healthStatus.description}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                BMI: {healthStatus.bmi} kg/m² | Stunting Risk: {healthStatus.stuntingRisk ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Growth Charts */}
      {measurements.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GrowthChart measurements={measurements} title="Weight Growth" type="weight" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GrowthChart measurements={measurements} title="Height Growth" type="height" />
          </motion.div>
        </div>
      )}

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Personalized Recommendations</h3>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <p className="text-foreground">{rec}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Measurement History */}
      {measurements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Measurement History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Height (cm)</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Weight (kg)</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">BMI</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Recorded by</th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.map((m, index) => {
                    const bmi = (m.weight / ((m.height / 100) * (m.height / 100))).toFixed(1);
                    return (
                      <tr key={m.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 text-foreground">
                          {new Date(m.timestamp).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-foreground">{m.height}</td>
                        <td className="py-3 px-4 text-foreground">{m.weight}</td>
                        <td className="py-3 px-4 text-foreground">{bmi}</td>
                        <td className="py-3 px-4 text-muted-foreground">Kader</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
