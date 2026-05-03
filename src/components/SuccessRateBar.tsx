import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LLMUsageRecord } from '../types';
import { colors, formatPercent } from '../lib/colors';

interface SuccessRateBarProps {
  data: LLMUsageRecord[];
}

export const SuccessRateBar: React.FC<SuccessRateBarProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const modelStats = new Map<string, { total: number; count: number }>();

    data.forEach(record => {
      if (!modelStats.has(record.Model)) {
        modelStats.set(record.Model, { total: 0, count: 0 });
      }
      const stats = modelStats.get(record.Model)!;
      stats.total += record.Success_Rate;
      stats.count += 1;
    });

    return Array.from(modelStats.entries())
      .map(([model, stats]) => ({
        model,
        successRate: stats.total / stats.count,
      }))
      .sort((a, b) => b.successRate - a.successRate);
  }, [data]);

  const getBarColor = (rate: number) => {
    if (rate >= 0.95) return colors.efficiency;
    if (rate >= 0.90) return colors.status.medium;
    return colors.cost;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
        Success Rate by Model
      </h3>
      <p className="text-sm mb-4" style={{ color: colors.text.secondary }}>
        Average request success rate across all departments.
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9ECEF" />
          <XAxis
            dataKey="model"
            tick={{ fill: colors.text.secondary, fontSize: 11 }}
            tickLine={{ stroke: '#E9ECEF' }}
            angle={-15}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fill: colors.text.secondary, fontSize: 12 }}
            tickLine={{ stroke: '#E9ECEF' }}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            domain={[0.85, 1.0]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E9ECEF',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            formatter={(value: any) => typeof value === 'number' ? formatPercent(value) : value}
            labelFormatter={(label) => `Model: ${label}`}
          />
          <Bar dataKey="successRate" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.successRate)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
