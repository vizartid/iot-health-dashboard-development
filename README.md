
# 📊 IoT Health Dashboard Development

[![Framework](https://img.shields.io/badge/Framework-React%2018-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Language](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Backend](https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Build Tool](https://img.shields.io/badge/Build%20Tool-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A modern, high-performance, and visually striking **IoT Health Monitoring Dashboard** designed to visualize real-time biometric telemetry from edge medical sensors. Built with modern web technologies, featuring low-latency data streams, advanced analytics, and a futuristic dark-themed user interface optimized for clinical or remote health monitoring.

---

## ⚡ Key Features

*   **Real-Time Biometric Telemetry:** Low-latency visualization of critical vitals (Heart Rate (BPM), SpO2, Body Temperature, Blood Pressure) via hardware streams.
*   **Futuristic & Minimalist Dashboard:** A clean, dark-themed UI with vibrant accents designed according to strict modern UI/UX principles.
*   **Sensor Status & Telemetry Automation:** Visual Indicators for device health, connectivity matrix, and edge node calibrations (Following Instrumentation logic).
*   **Historical Analytics & Logging:** Aggregated summaries and interactive charts tracking long-term vital stability.
*   **Patient Command Center:** An organized management hub to control thresholds and emergency trigger parameters.

---

## 🛠️ Tech Stack

*   **Frontend Architecture:** React (Functional Components, Hooks) with TypeScript for rigorous type safety.
*   **Styling Engine:** Tailwind CSS utilizing custom color variables (deep slate backgrounds, vibrant emerald and neon cyan highlights).
*   **State & Database:** Supabase for PostgreSQL real-time replication, auth state, and immediate data synchronization.
*   **Bundler & Dev Server:** Vite for ultra-fast Hot Module Replacement (HMR) and optimized production bundles.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local environment:
*   [Node.js](https://nodejs.org/) (v18.x or later)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/vizartid/iot-health-dashboard-development.git
   cd iot-health-dashboard-development
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and append your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📐 Architecture Overview

The system operates on a bottom-up instrumentation philosophy:
1.  **Sensor Layer:** Edge hardware measures vitals and transmits packages via MQTT/HTTP bridges.
2.  **Data Ingestion:** Supabase handles real-time continuous writes.
3.  **Visualization Matrix:** The dashboard subscribes to changes using Supabase Realtime client listeners, transforming raw telemetry states instantly into responsive interactive charting elements.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
