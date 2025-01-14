/ File: src/types/index.ts
export interface User {
  id: string;
  name: string;
  role: 'dj' | 'organizer' | 'manager';
}

export interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  capacity: number;
  organizerId: string;
}

export interface EngagementMetrics {
  timestamp: number;
  crowdDensity: number;
  sentiment: number;
  energyLevel: number;
  zoneData: Array<ZoneMetrics>;
}

export interface ZoneMetrics {
  zoneId: string;
  density: number;
  movement: number;
}

// File: src/components/Dashboard.tsx
import React from 'react';
import { useState, useEffect } from 'react';
import { EngagementMetrics } from '../types';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
  
  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:8080');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMetrics(data);
    };
    
    return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-3xl font-bold text-gray-900">Live Event Dashboard</h1>
          
          {metrics && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                title="Crowd Density"
                value={`${metrics.crowdDensity}%`}
                trend="increasing"
              />
              <MetricCard
                title="Sentiment"
                value={`${metrics.sentiment}/10`}
                trend="stable"
              />
              <MetricCard
                title="Energy Level"
                value={`${metrics.energyLevel}%`}
                trend="increasing"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// File: src/components/MetricCard.tsx
interface MetricCardProps {
  title: string;
  value: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-700">{value}</p>
          </div>
          <div className="ml-4">
            {/* Add trend indicator icon based on trend prop */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
