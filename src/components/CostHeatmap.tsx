import { useMemo } from 'react';
import { LLMUsageRecord } from '../types';
import { colors, formatCurrency } from '../lib/colors';

interface CostHeatmapProps {
  data: LLMUsageRecord[];
}

export const CostHeatmap: React.FC<CostHeatmapProps> = ({ data }) => {
  const { heatmapData, departments, models, maxCost } = useMemo(() => {
    const costMap = new Map<string, number>();
    const depts = new Set<string>();
    const mods = new Set<string>();

    data.forEach(record => {
      const key = `${record.Department}|${record.Model}`;
      costMap.set(key, (costMap.get(key) || 0) + record.Weekly_Cost);
      depts.add(record.Department);
      mods.add(record.Model);
    });

    const maxCostValue = Math.max(...Array.from(costMap.values()));

    return {
      heatmapData: costMap,
      departments: Array.from(depts).sort(),
      models: Array.from(mods).sort(),
      maxCost: maxCostValue,
    };
  }, [data]);

  const getCellColor = (cost: number) => {
    const intensity = cost / maxCost;
    if (intensity > 0.7) return colors.cost;
    if (intensity > 0.4) return '#FFB4AB';
    if (intensity > 0.2) return '#FFD7D1';
    return '#FFF0EE';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
        Cost Heatmap: Department × Model
      </h3>
      <p className="text-sm mb-4" style={{ color: colors.text.secondary }}>
        Darker cells indicate higher cumulative costs. Identify optimization targets.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2 bg-gray-50 text-left text-xs font-semibold" style={{ color: colors.text.secondary }}>
                Department \ Model
              </th>
              {models.map(model => (
                <th key={model} className="border border-gray-200 p-2 bg-gray-50 text-center text-xs font-semibold" style={{ color: colors.text.secondary }}>
                  {model}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {departments.map(dept => (
              <tr key={dept}>
                <td className="border border-gray-200 p-2 bg-gray-50 text-xs font-semibold" style={{ color: colors.text.secondary }}>
                  {dept}
                </td>
                {models.map(model => {
                  const key = `${dept}|${model}`;
                  const cost = heatmapData.get(key) || 0;
                  return (
                    <td
                      key={key}
                      className="border border-gray-200 p-2 text-center text-xs font-medium transition-all hover:scale-105"
                      style={{
                        backgroundColor: cost > 0 ? getCellColor(cost) : '#F8F9FA',
                        color: cost > maxCost * 0.5 ? 'white' : colors.text.primary,
                        cursor: 'pointer',
                      }}
                      title={`${dept} - ${model}: ${formatCurrency(cost)}`}
                    >
                      {cost > 0 ? formatCurrency(cost) : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
