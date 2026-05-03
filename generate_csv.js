const fs = require('fs');

// Configuration
const weeks = [];
const startDate = new Date('2025-01-01');
for (let i = 0; i < 52; i++) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + i * 7);
  weeks.push(date.toISOString().split('T')[0]);
}

const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'Customer_Support', 'Data_Science', 'Legal', 'Finance'];
const models = ['GPT-4', 'GPT-3.5-Turbo', 'Claude-3-Opus', 'Claude-3-Sonnet', 'Gemini-Pro', 'Llama-3-70B'];

const modelCostPer1k = {
  'GPT-4': 0.03,
  'Claude-3-Opus': 0.025,
  'Gemini-Pro': 0.02,
  'Claude-3-Sonnet': 0.008,
  'GPT-3.5-Turbo': 0.002,
  'Llama-3-70B': 0.001
};

const modelLatencyBase = {
  'GPT-4': 1200,
  'Claude-3-Opus': 1100,
  'Gemini-Pro': 1000,
  'Claude-3-Sonnet': 600,
  'GPT-3.5-Turbo': 400,
  'Llama-3-70B': 300
};

const modelSuccessRate = {
  'GPT-4': 0.98,
  'Claude-3-Opus': 0.97,
  'Gemini-Pro': 0.96,
  'Claude-3-Sonnet': 0.95,
  'GPT-3.5-Turbo': 0.93,
  'Llama-3-70B': 0.90
};

const deptWeeklyTokensBase = {
  'Engineering': 800000,
  'Product': 500000,
  'Marketing': 300000,
  'Sales': 250000,
  'Customer_Support': 600000,
  'Data_Science': 700000,
  'Legal': 150000,
  'Finance': 200000
};

const deptModelPreference = {
  'Engineering': {'GPT-4': 0.4, 'Claude-3-Opus': 0.3, 'Claude-3-Sonnet': 0.2, 'Llama-3-70B': 0.1},
  'Product': {'GPT-4': 0.5, 'Claude-3-Opus': 0.3, 'GPT-3.5-Turbo': 0.2},
  'Marketing': {'GPT-4': 0.3, 'Claude-3-Sonnet': 0.4, 'GPT-3.5-Turbo': 0.3},
  'Sales': {'GPT-3.5-Turbo': 0.5, 'Claude-3-Sonnet': 0.3, 'Gemini-Pro': 0.2},
  'Customer_Support': {'GPT-3.5-Turbo': 0.6, 'Claude-3-Sonnet': 0.3, 'Llama-3-70B': 0.1},
  'Data_Science': {'GPT-4': 0.4, 'Claude-3-Opus': 0.3, 'Llama-3-70B': 0.3},
  'Legal': {'GPT-4': 0.6, 'Claude-3-Opus': 0.4},
  'Finance': {'GPT-4': 0.5, 'Claude-3-Opus': 0.3, 'Gemini-Pro': 0.2}
};

function random(min, max) {
  return Math.random() * (max - min) + min;
}

const data = [];
const deptWeeklyAgg = new Map();

weeks.forEach((week, weekIdx) => {
  departments.forEach(dept => {
    const baseTokens = deptWeeklyTokensBase[dept];
    
    // Seasonal variance
    const seasonalFactor = 1 + 0.2 * Math.sin(2 * Math.PI * weekIdx / 52);
    
    // Anomaly spikes
    let anomalyFactor = 1.0;
    if (weekIdx === 12 || weekIdx === 13) {
      if (dept === 'Engineering' || dept === 'Product') {
        anomalyFactor = 2.5;
      }
    }
    if (weekIdx >= 38 && weekIdx <= 40) {
      if (dept === 'Finance' || dept === 'Product' || dept === 'Engineering') {
        anomalyFactor = 2.0;
      }
    }
    
    const weeklyDeptTokens = baseTokens * seasonalFactor * anomalyFactor * random(0.8, 1.2);
    const modelPrefs = deptModelPreference[dept] || {'GPT-3.5-Turbo': 1.0};
    
    let deptTotalCost = 0;
    let deptTotalLatency = 0;
    let deptTotalCache = 0;
    let modelCount = 0;
    
    Object.entries(modelPrefs).forEach(([model, pref]) => {
      const modelTokens = weeklyDeptTokens * pref * random(0.9, 1.1);
      const costPer1k = modelCostPer1k[model];
      const weeklyCost = (modelTokens / 1000) * costPer1k;
      
      const baseLatency = modelLatencyBase[model];
      const avgLatency = baseLatency * random(0.85, 1.15);
      
      const cacheProgress = weekIdx / 52;
      const baseCacheRate = 0.15 + 0.25 * cacheProgress;
      const cacheHitRate = Math.min(0.65, baseCacheRate * random(0.8, 1.2));
      
      const successRate = Math.min(1.0, modelSuccessRate[model] * random(0.98, 1.0));
      
      deptTotalCost += weeklyCost;
      deptTotalLatency += avgLatency;
      deptTotalCache += cacheHitRate;
      modelCount++;
      
      data.push({
        Week: week,
        Department: dept,
        Model: model,
        Weekly_Cost: Math.round(weeklyCost * 100) / 100,
        Weekly_Tokens: Math.round(modelTokens),
        Avg_Latency: Math.round(avgLatency * 10) / 10,
        Cache_Hit_Rate: Math.round(cacheHitRate * 1000) / 1000,
        Success_Rate: Math.round(successRate * 1000) / 1000,
        Dept_Total_Cost: 0, // Will fill later
        Dept_Avg_Latency: 0,
        Dept_Cache_Rate: 0
      });
    });
    
    const key = `${week}|${dept}`;
    deptWeeklyAgg.set(key, {
      totalCost: deptTotalCost,
      avgLatency: deptTotalLatency / modelCount,
      cacheRate: deptTotalCache / modelCount
    });
  });
});

// Fill department aggregates
data.forEach(record => {
  const key = `${record.Week}|${record.Department}`;
  const agg = deptWeeklyAgg.get(key);
  if (agg) {
    record.Dept_Total_Cost = Math.round(agg.totalCost * 100) / 100;
    record.Dept_Avg_Latency = Math.round(agg.avgLatency * 10) / 10;
    record.Dept_Cache_Rate = Math.round(agg.cacheRate * 1000) / 1000;
  }
});

// Sample to 8000 records
const shuffled = data.sort(() => Math.random() - 0.5);
const sampled = shuffled.slice(0, Math.min(8000, data.length));

// Generate CSV
const headers = Object.keys(sampled[0]).join(',');
const rows = sampled.map(row => Object.values(row).join(','));
const csv = [headers, ...rows].join('\n');

fs.writeFileSync('public/Enterprise_LLM_SMALL.csv', csv);
console.log(`Generated ${sampled.length} records`);
console.log(`Total cost in sample: $${sampled.reduce((sum, r) => sum + r.Weekly_Cost, 0).toFixed(2)}`);
