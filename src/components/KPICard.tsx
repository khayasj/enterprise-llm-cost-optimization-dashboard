import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { colors } from '../lib/colors';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon?: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, subtitle, trend, trendValue, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>
            {title}
          </p>
          <p className="text-3xl font-bold mt-2" style={{ color: colors.text.primary }}>
            {value}
          </p>
        </div>
        {icon && (
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
            {icon}
          </div>
        )}
      </div>
      
      {(subtitle || trend) && (
        <div className="flex items-center gap-2 mt-4">
          {trend && trendValue && (
            <div className="flex items-center gap-1">
              {trend === 'up' ? (
                <TrendingUp size={16} style={{ color: colors.cost }} />
              ) : (
                <TrendingDown size={16} style={{ color: colors.efficiency }} />
              )}
              <span
                className="text-sm font-medium"
                style={{ color: trend === 'up' ? colors.cost : colors.efficiency }}
              >
                {trendValue}
              </span>
            </div>
          )}
          {subtitle && (
            <span className="text-sm" style={{ color: colors.text.muted }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};
