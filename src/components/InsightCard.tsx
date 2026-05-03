import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { colors } from '../lib/colors';

interface InsightCardProps {
  type: 'problem' | 'success' | 'info';
  title: string;
  children: React.ReactNode;
}

export const InsightCard: React.FC<InsightCardProps> = ({ type, title, children }) => {
  const iconMap = {
    problem: <AlertCircle size={20} style={{ color: colors.cost }} />,
    success: <CheckCircle size={20} style={{ color: colors.efficiency }} />,
    info: <Info size={20} style={{ color: colors.neutral }} />,
  };

  const borderColorMap = {
    problem: colors.cost,
    success: colors.efficiency,
    info: colors.neutral,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border-l-4 rounded-lg p-6 shadow-sm mb-4"
      style={{ borderLeftColor: borderColorMap[type] }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{iconMap[type]}</div>
        <div className="flex-1">
          <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
            {title}
          </h4>
          <div className="text-sm" style={{ color: colors.text.secondary }}>
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
