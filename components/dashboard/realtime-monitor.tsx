'use client';

import { Card } from '@/components/ui/card';
import { Measurement, Child } from '@/types';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Clock } from 'lucide-react';

interface RealtimeMonitorProps {
  children: Child[];
  measurements: Record<string, Measurement>;
}

export function RealtimeMonitor({ children, measurements }: RealtimeMonitorProps) {
  // Simulate some devices being offline
  const isOnline = (index: number) => Math.random() > 0.05;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Real-time IoT Monitoring</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Last updated: now</span>
        </div>
      </div>

      <div className="space-y-3">
        {children.slice(0, 5).map((child, index) => {
          const online = isOnline(index);
          const measurement = measurements[child.id];

          return (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {child.name.charAt(0)}
                  </div>
                  <motion.div
                    animate={{
                      scale: online ? [1, 1.2, 1] : 1,
                      opacity: online ? 1 : 0.5,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                      online ? 'bg-emerald-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{child.name}</p>
                  {measurement ? (
                    <p className="text-xs text-muted-foreground">
                      H: {measurement.height}cm | W: {measurement.weight}kg
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">No data yet</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  {measurement && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(measurement.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    {online ? (
                      <>
                        <Wifi className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-600">Online</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-medium text-gray-400">Offline</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">Showing 5 of {children.length} devices</p>
      </div>
    </Card>
  );
}
