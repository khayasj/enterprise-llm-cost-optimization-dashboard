import { motion } from 'framer-motion';
import { Target, Zap, Shield } from 'lucide-react';
import { colors } from '../lib/colors';
import { AnalysisResults } from '../types';

interface RecommendationPanelProps {
  recommendations: AnalysisResults['recommendations'];
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({ recommendations }) => {
  const priorityIcons = {
    HIGH: <Target size={20} style={{ color: colors.cost }} />,
    MEDIUM: <Zap size={20} style={{ color: colors.status.medium }} />,
    LOW: <Shield size={20} style={{ color: colors.efficiency }} />,
  };

  const priorityColors = {
    HIGH: colors.cost,
    MEDIUM: colors.status.medium,
    LOW: colors.efficiency,
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
        Optimization Recommendations
      </h3>
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="border-l-4 rounded-lg p-4 bg-gray-50"
            style={{ borderLeftColor: priorityColors[rec.priority as keyof typeof priorityColors] }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {priorityIcons[rec.priority as keyof typeof priorityIcons]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded"
                    style={{
                      backgroundColor: priorityColors[rec.priority as keyof typeof priorityColors],
                      color: 'white',
                    }}
                  >
                    {rec.priority}
                  </span>
                  <h4 className="font-semibold" style={{ color: colors.text.primary }}>
                    {rec.title}
                  </h4>
                </div>
                <p className="text-sm mb-2" style={{ color: colors.text.secondary }}>
                  <strong>Impact:</strong> {rec.impact}
                </p>
                <p className="text-sm mb-2" style={{ color: colors.text.secondary }}>
                  <strong>Action:</strong> {rec.action}
                </p>
                <p className="text-xs" style={{ color: colors.text.muted }}>
                  <strong>Implementation:</strong> {rec.implementation}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
