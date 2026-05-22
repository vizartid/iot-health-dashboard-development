'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Child, Measurement } from '@/types';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateHealthStatus, calculateBMI } from '@/lib/health-analysis';
import { getAgeInMonths } from '@/lib/mock-data';

interface ChildrenTableProps {
  children: Child[];
  measurements: Record<string, Measurement>;
}

export function ChildrenTable({ children, measurements }: ChildrenTableProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredChildren = useMemo(() => {
    return children.filter((child) =>
      child.name.toLowerCase().includes(search.toLowerCase()) ||
      child.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [children, search]);

  const paginatedChildren = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredChildren.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredChildren, currentPage]);

  const totalPages = Math.ceil(filteredChildren.length / itemsPerPage);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Children Registry</h3>
        <Button className="bg-primary hover:bg-primary/90">Add New Child</Button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Age (months)</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Height (cm)</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Weight (kg)</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">BMI</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedChildren.map((child, index) => {
              const measurement = measurements[child.id];
              const ageMonths = getAgeInMonths(child.dateOfBirth);
              const bmi = measurement ? calculateBMI(measurement.weight, measurement.height) : 0;
              const health = measurement
                ? calculateHealthStatus(measurement.weight, measurement.height, ageMonths)
                : null;

              const statusColorClass = {
                'gizi-buruk': 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
                'gizi-kurang': 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
                'gizi-normal': 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
                'gizi-lebih': 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
              };

              return (
                <motion.tr
                  key={child.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {child.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{child.name}</p>
                        <p className="text-xs text-muted-foreground">{child.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground">{ageMonths}</td>
                  <td className="py-4 px-4 text-foreground">{measurement ? measurement.height : '-'}</td>
                  <td className="py-4 px-4 text-foreground">{measurement ? measurement.weight : '-'}</td>
                  <td className="py-4 px-4 text-foreground">{measurement ? bmi.toFixed(1) : '-'}</td>
                  <td className="py-4 px-4">
                    {health ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColorClass[health.status]}`}>
                        {health.description}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">No data</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <Link href={`/children/${child.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        View
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredChildren.length)} of{' '}
            {filteredChildren.length}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                  className="w-8 h-8"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
