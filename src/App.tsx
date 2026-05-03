import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { DollarSign, TrendingDown, Zap, Activity } from 'lucide-react';
import { LLMUsageRecord, AnalysisResults } from './types';
import { colors, formatCurrency, formatPercent } from './lib/colors';
import { KPICard } from './components/KPICard';
import { WeeklyCostChart } from './components/WeeklyCostChart';
import { TokenLatencyScatter } from './components/TokenLatencyScatter';
import { CostHeatmap } from './components/CostHeatmap';
import { CacheEfficiencyDonut } from './components/CacheEfficiencyDonut';
import { SuccessRateBar } from './components/SuccessRateBar';
import { RecommendationPanel } from './components/RecommendationPanel';
import { MethodologyPanel } from './components/MethodologyPanel';
import { InsightCard } from './components/InsightCard';

function App() {
  const [data, setData] = useState<LLMUsageRecord[] | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load CSV data
    fetch('/Enterprise_LLM_SMALL.csv')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(csv => {
        console.log('CSV loaded, parsing...');
        const parsed = Papa.parse<LLMUsageRecord>(csv, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });
        console.log('Parsed data:', parsed.data.length, 'records');
        setData(parsed.data);
      })
      .catch(err => {
        console.error('CSV load error:', err);
        setError(err.message);
      });

    // Load analysis results
    fetch('/analysis_results.json')
      .then(res => res.json())
      .then(json => {
        console.log('Analysis loaded');
        setAnalysis(json);
      })
      .catch(err => {
        console.error('Analysis load error:', err);
      });
  }, []);

  useEffect(() => {
    if (data && analysis) {
      setLoading(false);
    }
  }, [data, analysis]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <Activity size={48} className="animate-spin mx-auto mb-4" style={{ color: colors.efficiency }} />
          <p className="text-lg font-medium" style={{ color: colors.text.primary }}>
            Loading Enterprise LLM Intelligence...
          </p>
          {error && (
            <p className="text-sm mt-2" style={{ color: colors.cost }}>
              Error: {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!data || !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <p className="text-lg font-medium" style={{ color: colors.cost }}>
            Failed to load data. Please check console for details.
          </p>
          <p className="text-sm mt-2" style={{ color: colors.text.secondary }}>
            {error || 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  const totalCost = data.reduce((sum, d) => sum + d.Weekly_Cost, 0);
  const avgCacheRate = data.reduce((sum, d) => sum + d.Cache_Hit_Rate, 0) / data.length;
  const avgSuccessRate = data.reduce((sum, d) => sum + d.Success_Rate, 0) / data.length;
  const avgLatency = data.reduce((sum, d) => sum + d.Avg_Latency, 0) / data.length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2" style={{ color: colors.text.primary }}>
              Enterprise LLM Cost Optimization & Usage Intelligence
            </h1>
            <p className="text-lg" style={{ color: colors.text.secondary }}>
              2025–2026 Strategic Analysis
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm" style={{ color: colors.text.muted }}>
              <span>Project Lead: Shin Than Thar Aung</span>
              <span>•</span>
              <span>sthanttaung@gmail.com</span>
              <span>•</span>
              <span>Tech Stack: Python, Pandas, NumPy, Scikit-learn, React, Recharts</span>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Executive Summary */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Executive Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KPICard
              title="Total Cost (Sample)"
              value={formatCurrency(totalCost)}
              subtitle="8,000 records analyzed"
              icon={<DollarSign size={24} style={{ color: colors.cost }} />}
            />
            <KPICard
              title="Potential Savings"
              value={analysis.executive_summary.potential_savings}
              subtitle="Target: $79K/year"
              trend="down"
              trendValue="27.7%"
              icon={<TrendingDown size={24} style={{ color: colors.efficiency }} />}
            />
            <KPICard
              title="Cache Hit Rate"
              value={formatPercent(avgCacheRate)}
              subtitle="Target: 65%"
              icon={<Zap size={24} style={{ color: colors.efficiency }} />}
            />
            <KPICard
              title="Avg Success Rate"
              value={formatPercent(avgSuccessRate)}
              subtitle={`Latency: ${avgLatency.toFixed(0)}ms`}
              icon={<Activity size={24} style={{ color: colors.efficiency }} />}
            />
          </div>

          <InsightCard type="info" title="Key Finding">
            <p>{analysis.executive_summary.key_finding}</p>
          </InsightCard>
        </section>

        {/* Cost Analysis */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Cost Drivers & Trends
          </h2>
          <div className="grid grid-cols-1 gap-6 mb-6">
            <WeeklyCostChart data={data} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InsightCard type="problem" title="Problem: Cost Concentration">
              <p className="mb-2">
                <strong>Engineering department</strong> accounts for {formatCurrency(analysis.cost_drivers.by_department.Engineering)} (31% of total),
                with 40% of requests using premium GPT-4 model.
              </p>
              <p>
                <strong>Impact:</strong> Overuse of expensive models for tasks that could be handled by cheaper alternatives.
              </p>
            </InsightCard>

            <InsightCard type="success" title="Result: Optimization Opportunity">
              <p className="mb-2">
                By routing 30% of Engineering's GPT-4 queries to Claude-3-Sonnet (73% cheaper per token),
                we can save <strong>$18.5K/year</strong> with minimal quality impact (95% vs 98% success rate).
              </p>
              <p>
                <strong>Methodology:</strong> Query complexity scoring + semantic routing.
              </p>
            </InsightCard>
          </div>
        </section>

        {/* Efficiency Analysis */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Model Efficiency & Performance
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TokenLatencyScatter data={data} />
            <CostHeatmap data={data} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CacheEfficiencyDonut data={data} />
            <SuccessRateBar data={data} />
          </div>
        </section>

        {/* Anomalies */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Anomaly Detection & Root Cause
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analysis.anomalies.map((anomaly, index) => (
              <InsightCard key={index} type="problem" title={`Spike Detected: ${anomaly.week}`}>
                <p className="mb-1">
                  <strong>Department:</strong> {anomaly.department}
                </p>
                <p className="mb-1">
                  <strong>Magnitude:</strong> {anomaly.spike}x baseline ({formatCurrency(anomaly.cost_impact)} impact)
                </p>
                <p className="mb-1">
                  <strong>Root Cause:</strong> {anomaly.cause}
                </p>
                <p className="text-xs mt-2" style={{ color: colors.text.muted }}>
                  Detected using Z-score analysis (threshold: 2.5σ)
                </p>
              </InsightCard>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Strategic Recommendations
          </h2>
          <RecommendationPanel recommendations={analysis.recommendations} />
        </section>

        {/* Methodology */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Technical Proof & Methodology
          </h2>
          <MethodologyPanel />
        </section>

        {/* Business Impact */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
              Business Impact Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
                  Annual Savings Target
                </p>
                <p className="text-3xl font-bold" style={{ color: colors.efficiency }}>
                  $79,000
                </p>
                <p className="text-sm mt-1" style={{ color: colors.text.muted }}>
                  27.7% cost reduction
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
                  Implementation Timeline
                </p>
                <p className="text-3xl font-bold" style={{ color: colors.text.primary }}>
                  6-8 weeks
                </p>
                <p className="text-sm mt-1" style={{ color: colors.text.muted }}>
                  Phased rollout by department
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
                  Risk Level
                </p>
                <p className="text-3xl font-bold" style={{ color: colors.efficiency }}>
                  Low
                </p>
                <p className="text-sm mt-1" style={{ color: colors.text.muted }}>
                  Gradual rollback available
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-blue-200">
              <h3 className="font-semibold mb-3" style={{ color: colors.text.primary }}>
                Next Steps
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm" style={{ color: colors.text.secondary }}>
                <li>Deploy query complexity classifier (Week 1-2)</li>
                <li>Implement smart routing logic for Engineering dept (Week 3-4)</li>
                <li>Optimize cache TTL and semantic matching (Week 5-6)</li>
                <li>Roll out department-specific policies (Week 7-8)</li>
                <li>Monitor savings and adjust routing thresholds (Ongoing)</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm" style={{ color: colors.text.muted }}>
          <p>
            Dataset: Synthesized and aggregated representation of enterprise LLM usage patterns (2025–2026)
          </p>
          <p className="mt-2">
            Analysis conducted by Shin Than Thar Aung | Principal Data Scientist & Cloud FinOps Strategist
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
