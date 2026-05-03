import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ZAxis } from 'recharts';
import { LLMUsageRecord } from '../types';
import { colors, formatNumber } from '../lib/colors';

interface TokenLatencyScatterProps {
  data: LLMUsageRecord[];
}

export const TokenLatencyScatter: React.FC<TokenLatencyScatterProps> = ({ data }) => {
  const models = useMemo(() => {
    return Array.from(new Set(data.map(d => d.Model)));
  }, [data]);

  const scatterData = useMemo(() => {
    const modelData: Record<string, any[]> = {};
    
    models.forEach(model => {
      modelData[model] = data
        .filter(d => d.Model === model)
        .map(d => ({
          x: d.Weekly_Tokens,
          y: d.Avg_Latency,
          z: d.Weekly_Cost,
        }));
    });
    
    return modelData;
  }, [data, models]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
        Token Volume vs Latency by Model
      </h3>
      <p className="text-sm mb-4" style={{ color: colors.text.secondary }}>
        Bubble size represents cost. Lower-left quadrant is optimal (low latency, efficient token usage).
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9ECEF" />
          <XAxis
            type="number"
            dataKey="x"
            name="Tokens"
            tick={{ fill: colors.text.secondary, fontSize: 12 }}
            tickLine={{ stroke: '#E9ECEF' }}
            label={{ value: 'Weekly Tokens', position: 'insideBottom', offset: -5, fill: colors.text.secondary }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Latency"
            tick={{ fill: colors.text.secondary, fontSize: 12 }}
            tickLine={{ stroke: '#E9ECEF' }}
            label={{ value: 'Avg Latency (ms)', angle: -90, position: 'insideLeft', fill: colors.text.secondary }}
          />
          <ZAxis type="number" dataKey="z" range={[50, 400]} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E9ECEF',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            formatter={(value: any, name: any) => {
              if (typeof value !== 'number') return value;
              if (name === 'Tokens') return formatNumber(value);
              if (name === 'Latency') return `${value.toFixed(0)}ms`;
              if (name === 'Cost') return `$${value.toFixed(2)}`;
              return value;
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          {models.map((model) => (
            <Scatter
              key={model}
              name={model}
              data={scatterData[model]}
              fill={colors.models[model as keyof typeof colors.models] || colors.chart.primary}
              fillOpacity={0.6}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
