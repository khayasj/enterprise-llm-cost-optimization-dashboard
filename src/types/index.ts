export interface LLMUsageRecord {
  Week: string;
  Department: string;
  Model: string;
  Weekly_Cost: number;
  Weekly_Tokens: number;
  Avg_Latency: number;
  Cache_Hit_Rate: number;
  Success_Rate: number;
  Dept_Total_Cost: number;
  Dept_Avg_Latency: number;
  Dept_Cache_Rate: number;
}

export interface AnalysisResults {
  executive_summary: {
    total_cost: number;
    avg_weekly_cost: number;
    top_cost_driver: string;
    potential_savings: string;
    key_finding: string;
  };
  cost_drivers: {
    by_department: Record<string, number>;
    by_model: Record<string, number>;
  };
  anomalies: Array<{
    week: string;
    department: string;
    spike: number;
    cause: string;
    cost_impact: number;
  }>;
  efficiency_metrics: {
    cache_impact: {
      avg_cache_rate: number;
      potential_rate: number;
      savings_opportunity: number;
    };
    model_efficiency: Record<string, {
      cost_per_1k: number;
      latency: number;
      success_rate: number;
    }>;
  };
  recommendations: Array<{
    priority: string;
    title: string;
    impact: string;
    action: string;
    implementation: string;
  }>;
}
