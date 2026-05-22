import { Child, Measurement, User } from '@/types';

// Mock Users
export const MOCK_USERS: Record<string, User> = {
  admin1: {
    id: 'admin1',
    name: 'Dr. Siti Nurhaliza',
    email: 'siti.nurhaliza@posyandu.id',
    role: 'admin',
    posyanduLocation: 'Posyandu Ceria, Jakarta Pusat',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  kader1: {
    id: 'kader1',
    name: 'Ibu Sinta',
    email: 'sinta@posyandu.id',
    role: 'kader',
    posyanduLocation: 'Posyandu Ceria, Jakarta Pusat',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
};

// Indonesian names for children
const childrenNames = [
  'Adi Pratama', 'Budi Santoso', 'Citra Dewi', 'Dewi Lestari', 'Eka Putri',
  'Fajar Imam', 'Gita Ayu', 'Hendra Kusuma', 'Indah Sari', 'Joko Widodo',
  'Kirana Ayu', 'Lestari Rahayu', 'Mika Saputra', 'Nia Aprilia', 'Oki Pratama',
];

// Mock Children
export const MOCK_CHILDREN: Child[] = childrenNames.map((name, index) => ({
  id: `child-${index + 1}`,
  name,
  dateOfBirth: new Date(2020 + Math.floor(index / 5), Math.random() * 12, Math.random() * 28 + 1)
    .toISOString()
    .split('T')[0],
  gender: Math.random() > 0.5 ? 'male' : 'female',
  posyanduId: 'posyandu-1',
  photo: `https://images.unsplash.com/photo-${1494790108377 + index}?w=400&h=400&fit=crop`,
  createdAt: new Date(2023, 0, 1).toISOString(),
}));

// Mock Measurements
export const MOCK_MEASUREMENTS: Measurement[] = [];

// Generate measurements for each child
MOCK_CHILDREN.forEach((child) => {
  const baseDate = new Date();
  // Generate 6 measurements over past 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setMonth(date.getMonth() - i);

    const ageMonths =
      (new Date().getTime() - new Date(child.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30.44);

    // Growth progression
    const heightBase = 60 + (ageMonths / 60) * 40;
    const weightBase = 3.5 + (ageMonths / 60) * 15;

    const height = heightBase + (Math.random() - 0.5) * 5;
    const weight = weightBase + (Math.random() - 0.5) * 2;

    MOCK_MEASUREMENTS.push({
      id: `measurement-${child.id}-${i}`,
      childId: child.id,
      height: parseFloat(height.toFixed(1)),
      weight: parseFloat(weight.toFixed(1)),
      timestamp: date.toISOString(),
      createdBy: 'kader1',
    });
  }
});

// Helper to get latest measurement for a child
export const getLatestMeasurement = (childId: string): Measurement | undefined => {
  return MOCK_MEASUREMENTS.filter((m) => m.childId === childId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .at(0);
};

// Helper to get child age in months
export const getAgeInMonths = (dateOfBirth: string): number => {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  return Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
};
