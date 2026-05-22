import { HealthStatus } from '@/types';

export function calculateBMI(weight: number, height: number): number {
  // height is in cm, convert to meters
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

export function calculateHealthStatus(
  weight: number,
  height: number,
  ageMonths: number
): HealthStatus {
  const bmi = calculateBMI(weight, height);

  // Stunting check: height for age
  // Based on WHO standards, approximate heights for children
  const standardHeights: Record<number, number> = {
    6: 67,
    12: 76,
    18: 82,
    24: 87,
    30: 91,
    36: 95,
    42: 98,
    48: 101,
    54: 104,
    60: 107,
  };

  // Find nearest age bracket
  const nearestAge = Math.min(...Object.keys(standardHeights).map(Number));
  const standardHeight = standardHeights[nearestAge] || 75;
  const heightPercentage = (height / standardHeight) * 100;
  const stuntingRisk = heightPercentage < 92; // Below 92% = stunting risk

  let status: 'gizi-buruk' | 'gizi-kurang' | 'gizi-normal' | 'gizi-lebih';
  let colorCode: string;
  let description: string;

  if (bmi < 12) {
    status = 'gizi-buruk';
    colorCode = '#EF4444'; // red
    description = 'Gizi Buruk - Perlu Intervensi Segera';
  } else if (bmi < 14.9) {
    status = 'gizi-kurang';
    colorCode = '#F97316'; // orange
    description = 'Gizi Kurang - Pantau & Tingkatkan Nutrisi';
  } else if (bmi <= 18) {
    status = 'gizi-normal';
    colorCode = '#10B981'; // emerald (primary color)
    description = 'Gizi Normal - Status Baik';
  } else {
    status = 'gizi-lebih';
    colorCode = '#8B5CF6'; // purple
    description = 'Gizi Lebih - Kurangi Asupan Kalori';
  }

  return {
    bmi: parseFloat(bmi.toFixed(1)),
    status,
    stuntingRisk,
    colorCode,
    description,
  };
}

// Generate personalized recommendations based on health status
export function generateRecommendations(healthStatus: HealthStatus): string[] {
  const recommendations: string[] = [];

  switch (healthStatus.status) {
    case 'gizi-buruk':
      recommendations.push('Konsultasi dengan tenaga kesehatan profesional segera');
      recommendations.push('Tingkatkan asupan protein: telur, ikan, daging, kacang-kacangan');
      recommendations.push('Pemberian makanan tambahan (PMT) yang kaya nutrisi');
      recommendations.push('Monitor pertumbuhan setiap minggu');
      break;
    case 'gizi-kurang':
      recommendations.push('Tingkatkan frekuensi pemberian makanan bergizi');
      recommendations.push('Pastikan asupan susu: 2-3 gelas per hari');
      recommendations.push('Tambahkan sayuran hijau dan buah-buahan dalam setiap makan');
      recommendations.push('Monitor perkembangan setiap 2 minggu');
      break;
    case 'gizi-normal':
      recommendations.push('Pertahankan pola makan sehat dan seimbang');
      recommendations.push('Lanjutkan pemberian ASI/makanan bergizi');
      recommendations.push('Perbanyak aktivitas fisik dan bermain');
      recommendations.push('Monitor pertumbuhan setiap bulan');
      break;
    case 'gizi-lebih':
      recommendations.push('Kurangi konsumsi makanan manis dan berlemak');
      recommendations.push('Perbanyak aktivitas fisik dan olahraga');
      recommendations.push('Pastikan asupan sayur dan buah cukup');
      recommendations.push('Monitor asupan kalori harian');
      break;
  }

  if (healthStatus.stuntingRisk) {
    recommendations.push('⚠️ Risiko stunting terdeteksi - perlu perhatian khusus pada nutrisi dan infeksi');
  }

  return recommendations;
}
