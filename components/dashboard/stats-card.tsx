'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: number;
  icon: React.ReactNode;
  color: 'emerald' | 'blue' | 'orange' | 'red' | 'purple';
}

const colorClasses = {
  emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
};

const iconBgClasses = {
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40',
  blue: 'bg-blue-100 dark:bg-blue-900/40',
  orange: 'bg-orange-100 dark:bg-orange-900/40',
  red: 'bg-red-100 dark:bg-red-900/40',
  purple: 'bg-purple-100 dark:bg-purple-900/40',
};

export function StatsCard({
  title,
  value,
  unit,
  trend,
  icon,
  color,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-foreground"
              >
                {value}
              </motion.p>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
            {trend !== undefined && (
              <div className="mt-2 flex items-center gap-1">
                {trend >= 0 ? (
                  <>
                    <ArrowUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs text-emerald-600">{trend}% from last month</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-red-600">{Math.abs(trend)}% from last month</span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
            <div className={colorClasses[color]}>{icon}</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
