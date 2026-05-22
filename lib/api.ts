import { MOCK_CHILDREN, MOCK_MEASUREMENTS, getLatestMeasurement, getAgeInMonths } from './mock-data';
import { calculateHealthStatus, generateRecommendations } from './health-analysis';
import { ApiResponse, Child, DashboardStats, Measurement } from '@/types';

// Children API
export async function getChildren(): Promise<ApiResponse<Child[]>> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      data: MOCK_CHILDREN,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch children',
    };
  }
}

export async function getChildById(id: string): Promise<ApiResponse<Child>> {
  try {
    const child = MOCK_CHILDREN.find((c) => c.id === id);
    if (!child) {
      return {
        success: false,
        error: 'Child not found',
      };
    }
    return {
      success: true,
      data: child,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch child',
    };
  }
}

// Measurements API
export async function getMeasurementsForChild(childId: string): Promise<ApiResponse<Measurement[]>> {
  try {
    const measurements = MOCK_MEASUREMENTS.filter((m) => m.childId === childId).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return {
      success: true,
      data: measurements,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch measurements',
    };
  }
}

// Health Analysis API
export async function analyzeChildHealth(childId: string): Promise<
  ApiResponse<{
    childId: string;
    latestMeasurement: Measurement | null;
    healthStatus: ReturnType<typeof calculateHealthStatus>;
    recommendations: string[];
  }>
> {
  try {
    const child = MOCK_CHILDREN.find((c) => c.id === childId);
    if (!child) {
      return {
        success: false,
        error: 'Child not found',
      };
    }

    const latestMeasurement = getLatestMeasurement(childId);
    if (!latestMeasurement) {
      return {
        success: false,
        error: 'No measurements found for this child',
      };
    }

    const ageMonths = getAgeInMonths(child.dateOfBirth);
    const healthStatus = calculateHealthStatus(latestMeasurement.weight, latestMeasurement.height, ageMonths);
    const recommendations = generateRecommendations(healthStatus);

    return {
      success: true,
      data: {
        childId,
        latestMeasurement,
        healthStatus,
        recommendations,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze health',
    };
  }
}

// Dashboard Statistics
export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  try {
    let childrenAtRisk = 0;
    let normalCount = 0;
    let warningCount = 0;
    let criticalCount = 0;

    for (const child of MOCK_CHILDREN) {
      const measurement = getLatestMeasurement(child.id);
      if (!measurement) continue;

      const ageMonths = getAgeInMonths(child.dateOfBirth);
      const health = calculateHealthStatus(measurement.weight, measurement.height, ageMonths);

      if (health.status === 'gizi-buruk' || health.stuntingRisk) {
        childrenAtRisk++;
        criticalCount++;
      } else if (health.status === 'gizi-kurang') {
        warningCount++;
      } else {
        normalCount++;
      }
    }

    return {
      success: true,
      data: {
        totalChildren: MOCK_CHILDREN.length,
        childrenAtRisk,
        averageNutritionalStatus: {
          normal: normalCount,
          warning: warningCount,
          critical: criticalCount,
        },
        deviceStatus: {
          online: Math.floor(MOCK_CHILDREN.length * 0.95),
          offline: Math.ceil(MOCK_CHILDREN.length * 0.05),
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
    };
  }
}
