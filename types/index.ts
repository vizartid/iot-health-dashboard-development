// User & Auth Types
export type UserRole = 'admin' | 'kader';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  posyanduLocation?: string;
  avatar?: string;
}

// Child Health Data Types
export interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  posyanduId: string;
  photo?: string;
  createdAt: string;
}

export interface Measurement {
  id: string;
  childId: string;
  height: number; // in cm
  weight: number; // in kg
  timestamp: string;
  createdBy: string;
}

export interface HealthStatus {
  bmi: number;
  status: 'gizi-buruk' | 'gizi-kurang' | 'gizi-normal' | 'gizi-lebih';
  stuntingRisk: boolean;
  colorCode: string;
  description: string;
}

// Recommendation Types
export interface Recommendation {
  id: string;
  childId: string;
  type: 'nutrition' | 'feeding' | 'warning';
  content: string;
  timestamp: string;
  status: 'active' | 'archived';
}

// Dashboard Statistics
export interface DashboardStats {
  totalChildren: number;
  childrenAtRisk: number;
  averageNutritionalStatus: {
    normal: number;
    warning: number;
    critical: number;
  };
  deviceStatus: {
    online: number;
    offline: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
