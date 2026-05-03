import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { LLMUsageRecord } from '../types';
import { colors, formatCurrency } from '../lib/colors';

interface CacheEfficiencyDonutProps {
  data: LLMUsageRecord[];
}

export const CacheEfficiencyDonut: React.FC<CacheEfficiencyDonutProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const totalCost = data.reduce((sum, d) => sum + d.Weekly_Cost, 0);
    const avgCacheRate = data.reduce((sum, d) => sum + d.Cache_Hit_Rate, 0) / data.length;
    const cacheSavings = totalCost * avgCacheRate;
    const actualCost = totalCost - cacheSavings;

    return [
      { name: 'Cache Savings', value: cacheSavings, color: colors.efficiency },
      { name: 'Actual Cost', value: actualCost, color: colors.cost },
    ];
  }, [data]);

  const renderLabel = (entry: any) => {
    return `${entry.name}: ${formatCurrency(entry.value)}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
        Cache Efficiency Impact
      </h3>
      <p className="text-sm mb-4" style={{ color: colors.text.secondary }}>
        Cost savings from cache hits vs actual spending.
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={renderLabel}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E9ECEF',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            formatter={(value: any) => typeof value === 'number' ? formatCurrency(value) : value}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
