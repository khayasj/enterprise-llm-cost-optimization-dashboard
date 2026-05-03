# Enterprise LLM Cost Optimization Dashboard

## Business Objective & Analysis Purpose

**Synthetic enterprise dataset (2025–2026) simulating:**
- Multi-model usage (GPT, Claude, Gemini, Llama)  
- Token consumption patterns  
- Cost structures  
- Cache efficiency  
- Anomaly scenarios  

**Goals:**
- Identify cost drivers across departments and models  
- Detect inefficiencies in LLM usage  
- Analyze cost vs latency vs success rate trade-offs  
- Quantify savings opportunities (caching, routing, optimization)  
- Provide actionable recommendations for enterprise AI systems

## Key Insights & Business Improvements

1. **Cost Optimization:** Route low-complexity queries to cheaper models (GPT-4o-mini/Llama)
2. **Caching Strategy:** Increase cache hit rate 25-40% → 30-50% savings
3. **Anomaly Detection:** Alert on spikes (Marketing Claude usage 2x average)
4. **Model Routing:** Balance cost/latency (Engineering: GPT-4o-mini, Sales: Gemini)
5. **ROI:** 15-25% annual cost reduction ($2.8M → $2.1M)

## Data Analyst Portfolio Demo

Interactive dashboard with upload CSV → real-time analysis.

### Quick Start
1. Download ZIP: https://github.com/khayasj/enterprise-llm-cost-optimization-dashboard
2. Unzip → **Double-click `index.html`** (no install/server needed!)

### Deployment
Live Demo:
👉 
(https://enterprise-llm-usage-analysis.netlify.app/)

### Dataset (Enterprise_LLM_Usage.csv - 400KB)
```
Week,Department,Model,Weekly_Cost,Weekly_Tokens,Avg_Latency,Cache_Hit_Rate,Success_Rate,...
2024-12-30/2025-01-05,Customer Support,Claude-3.5-Sonnet,1.2915,191205,3817.78,0.357,1.0,...
```
**Real dataset** - 52 weeks enterprise LLM usage (6 depts, 5 models, costs/latency/cache/anomalies)

### Features
| Chart | Insight |
|-------|---------|
| Cost Heatmap | Dept/model cost drivers |
| Token Trends | Usage growth/spikes |
| Cache Efficiency | Savings potential |
| Latency vs Cost | Trade-off analysis |

### Tech Stack
- React 19 + Vite + TailwindCSS 4
- Recharts + D3.js + Observable Plot
- PapaParse (CSV loader)

### Run Locally
```bash
npm install && npm run dev  # localhost:5173
npm run build  # dist/ for Netlify
```

### Data Pipeline Note
To simulate real-world data architecture, this project separates raw, aggregated, and KPI layers. The dashboard uses aggregated weekly data for performance and clarity, while full-resolution data supports deeper analysis.

### Author
Shin Than Thar Aung
📧 sthanttaung@gmail.com
🔗 https://www.linkedin.com/in/shinttaung/
