import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LLMUsageRecord } from '../types';
import { colors, formatCurrency } from '../lib/colors';

interface WeeklyCostChartProps {
  data: LLMUsageRecord[];
}

export const WeeklyCostChart: React.FC<WeeklyCostChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const weeklyData = new Map<string, Record<string, number>>();
    
    data.forEach(record => {
      if (!weeklyData.has(record.Week)) {
        weeklyData.set(record.Week, {});
      }
      const week = weeklyData.get(record.Week)!;
      week[record.Department] = (week[record.Department] || 0) + record.Weekly_Cost;
    });

    return Array.from(weeklyData.entries())
      .map(([week, depts]) => ({
        week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ...depts,
      }))
      .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());
  }, [data]);

  const departments = useMemo(() => {
    return Array.from(new Set(data.map(d => d.Department)));
  }, [data]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
        Weekly Cost by Department
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9ECEF" />
          <XAxis
            dataKey="week"
            tick={{ fill: colors.text.secondary, fontSize: 12 }}
            tickLine={{ stroke: '#E9ECEF' }}
          />
          <YAxis
            tick={{ fill: colors.text.secondary, fontSize: 12 }}
            tickLine={{ stroke: '#E9ECEF' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
          />
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
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          {departments.map((dept, index) => (
            <Area
              key={dept}
              type="monotone"
              dataKey={dept}
              stackId="1"
              stroke={colors.departments[dept as keyof typeof colors.departments] || colors.chart.primary}
              fill={colors.departments[dept as keyof typeof colors.departments] || colors.chart.primary}
              fillOpacity={0.8}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
