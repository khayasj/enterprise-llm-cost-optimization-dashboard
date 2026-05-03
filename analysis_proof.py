#!/usr/bin/env python3
"""
Enterprise LLM Cost Optimization - Statistical Analysis & Proof
Author: Shin Than Thar Aung
Email: sthanttaung@gmail.com

This script demonstrates the complete analytical methodology with reproducible calculations.
"""

import pandas as pd
import numpy as np
from typing import Dict, Tuple
import json

# Configuration
CSV_PATH = 'public/Enterprise_LLM_SMALL.csv'
OUTPUT_PATH = 'analysis_output.json'

def load_data(path: str) -> pd.DataFrame:
    """Load and validate dataset."""
    df = pd.read_csv(path)
    print(f"✓ Loaded {len(df)} records")
    print(f"  Columns: {list(df.columns)}")
    print(f"  Date range: {df['Week'].min()} to {df['Week'].max()}")
    return df

def analyze_cost_drivers(df: pd.DataFrame) -> Dict:
    """Identify top cost drivers by department and model."""
    dept_costs = df.groupby('Department')['Weekly_Cost'].sum().sort_values(ascending=False)
    model_costs = df.groupby('Model')['Weekly_Cost'].sum().sort_values(ascending=False)
    
    print("\n=== COST DRIVERS ===")
    print("\nTop Departments:")
    for dept, cost in dept_costs.head(3).items():
        pct = (cost / dept_costs.sum()) * 100
        print(f"  {dept}: ${cost:,.2f} ({pct:.1f}%)")
    
    print("\nTop Models:")
    for model, cost in model_costs.head(3).items():
        pct = (cost / model_costs.sum()) * 100
        print(f"  {model}: ${cost:,.2f} ({pct:.1f}%)")
    
    return {
        'by_department': dept_costs.to_dict(),
        'by_model': model_costs.to_dict()
    }

def detect_anomalies(df: pd.DataFrame, threshold: float = 2.5) -> list:
    """Detect cost spikes using Z-score analysis."""
    dept_weekly = df.groupby(['Week', 'Department'])['Weekly_Cost'].sum().reset_index()
    anomalies = []
    
    print(f"\n=== ANOMALY DETECTION (threshold: {threshold}σ) ===")
    
    for dept in df['Department'].unique():
        dept_data = dept_weekly[dept_weekly['Department'] == dept].copy()
        mean = dept_data['Weekly_Cost'].mean()
        std = dept_data['Weekly_Cost'].std()
        
        dept_data['z_score'] = (dept_data['Weekly_Cost'] - mean) / std
        dept_anomalies = dept_data[dept_data['z_score'] > threshold]
        
        for _, row in dept_anomalies.iterrows():
            spike_magnitude = row['Weekly_Cost'] / mean
            anomaly = {
                'week': row['Week'],
                'department': dept,
                'cost': row['Weekly_Cost'],
                'baseline': mean,
                'spike_magnitude': spike_magnitude,
                'z_score': row['z_score']
            }
            anomalies.append(anomaly)
            print(f"  {row['Week']} | {dept} | {spike_magnitude:.2f}x spike (z={row['z_score']:.2f})")
    
    return anomalies

def analyze_model_efficiency(df: pd.DataFrame) -> pd.DataFrame:
    """Calculate efficiency metrics for each model."""
    model_stats = df.groupby('Model').agg({
        'Weekly_Cost': 'sum',
        'Weekly_Tokens': 'sum',
        'Avg_Latency': 'mean',
        'Success_Rate': 'mean'
    }).reset_index()
    
    # Cost per 1K tokens
    model_stats['cost_per_1k'] = (
        model_stats['Weekly_Cost'] / (model_stats['Weekly_Tokens'] / 1000)
    )
    
    # Efficiency score (lower is better)
    model_stats['efficiency_score'] = (
        model_stats['cost_per_1k'] * 
        model_stats['Avg_Latency'] / 
        (model_stats['Success_Rate'] * 1000)
    )
    
    print("\n=== MODEL EFFICIENCY ===")
    print(model_stats[['Model', 'cost_per_1k', 'Avg_Latency', 'Success_Rate', 'efficiency_score']]
          .sort_values('efficiency_score')
          .to_string(index=False))
    
    return model_stats

def calculate_routing_savings(df: pd.DataFrame) -> Dict:
    """Calculate savings from smart model routing."""
    # Engineering GPT-4 usage
    eng_gpt4 = df[(df['Department'] == 'Engineering') & (df['Model'] == 'GPT-4')]
    total_tokens = eng_gpt4['Weekly_Tokens'].sum()
    
    # Route 30% to Claude-3-Sonnet
    routed_tokens = total_tokens * 0.30
    
    # Cost difference
    gpt4_cost_per_1k = 0.030
    sonnet_cost_per_1k = 0.008
    cost_diff = gpt4_cost_per_1k - sonnet_cost_per_1k
    
    # Annual savings
    weekly_savings = (routed_tokens / 1000) * cost_diff
    annual_savings = weekly_savings * 52
    
    print("\n=== SMART ROUTING SAVINGS ===")
    print(f"  Engineering GPT-4 tokens: {total_tokens:,.0f}")
    print(f"  Tokens to route (30%): {routed_tokens:,.0f}")
    print(f"  Cost difference: ${cost_diff:.3f}/1K")
    print(f"  Weekly savings: ${weekly_savings:,.2f}")
    print(f"  Annual savings: ${annual_savings:,.2f}")
    
    return {
        'total_tokens': total_tokens,
        'routed_tokens': routed_tokens,
        'weekly_savings': weekly_savings,
        'annual_savings': annual_savings
    }

def calculate_cache_savings(df: pd.DataFrame) -> Dict:
    """Calculate savings from cache optimization."""
    total_cost = df['Weekly_Cost'].sum()
    current_cache_rate = df['Cache_Hit_Rate'].mean()
    target_cache_rate = 0.65
    
    # Assumption: Cache hits cost 10% of full requests
    cache_cost_multiplier = 0.10
    
    current_savings = total_cost * current_cache_rate * (1 - cache_cost_multiplier)
    potential_savings = total_cost * target_cache_rate * (1 - cache_cost_multiplier)
    incremental_savings = potential_savings - current_savings
    
    # Annual projection
    annual_incremental = incremental_savings * 52
    
    print("\n=== CACHE OPTIMIZATION SAVINGS ===")
    print(f"  Total cost (sample): ${total_cost:,.2f}")
    print(f"  Current cache rate: {current_cache_rate:.1%}")
    print(f"  Target cache rate: {target_cache_rate:.1%}")
    print(f"  Incremental savings (weekly): ${incremental_savings:,.2f}")
    print(f"  Annual savings: ${annual_incremental:,.2f}")
    
    return {
        'current_rate': current_cache_rate,
        'target_rate': target_cache_rate,
        'weekly_savings': incremental_savings,
        'annual_savings': annual_incremental
    }

def calculate_total_savings(routing: Dict, cache: Dict) -> Dict:
    """Calculate total optimization savings."""
    total_annual = routing['annual_savings'] + cache['annual_savings']
    
    # Add department policy savings (estimated)
    dept_policy_savings = 18000
    grand_total = total_annual + dept_policy_savings
    
    print("\n=== TOTAL SAVINGS POTENTIAL ===")
    print(f"  Smart Routing: ${routing['annual_savings']:,.2f}/year")
    print(f"  Cache Optimization: ${cache['annual_savings']:,.2f}/year")
    print(f"  Department Policies: ${dept_policy_savings:,.2f}/year")
    print(f"  GRAND TOTAL: ${grand_total:,.2f}/year")
    
    # Conservative estimate (80% of calculated)
    conservative = grand_total * 0.80
    print(f"  Conservative (80%): ${conservative:,.2f}/year")
    
    return {
        'routing': routing['annual_savings'],
        'cache': cache['annual_savings'],
        'dept_policies': dept_policy_savings,
        'total': grand_total,
        'conservative': conservative
    }

def regression_analysis(df: pd.DataFrame) -> Dict:
    """Perform token-latency regression analysis."""
    from sklearn.linear_model import LinearRegression
    
    X = df[['Weekly_Tokens']].values
    y = df['Avg_Latency'].values
    
    model = LinearRegression()
    model.fit(X, y)
    
    r_squared = model.score(X, y)
    coefficient = model.coef_[0]
    intercept = model.intercept_
    
    print("\n=== REGRESSION ANALYSIS: Tokens vs Latency ===")
    print(f"  R² = {r_squared:.3f}")
    print(f"  Coefficient = {coefficient:.6f} (ms per token)")
    print(f"  Intercept = {intercept:.2f} ms")
    print(f"  Interpretation: Every 100K tokens adds ~{coefficient * 100000:.1f}ms latency")
    
    return {
        'r_squared': r_squared,
        'coefficient': coefficient,
        'intercept': intercept
    }

def generate_summary(df: pd.DataFrame, results: Dict) -> Dict:
    """Generate executive summary."""
    total_cost = df['Weekly_Cost'].sum()
    avg_cache = df['Cache_Hit_Rate'].mean()
    avg_success = df['Success_Rate'].mean()
    
    summary = {
        'dataset': {
            'records': len(df),
            'weeks': df['Week'].nunique(),
            'departments': df['Department'].nunique(),
            'models': df['Model'].nunique()
        },
        'metrics': {
            'total_cost_sample': total_cost,
            'avg_cache_rate': avg_cache,
            'avg_success_rate': avg_success
        },
        'savings': results['savings'],
        'top_department': max(results['cost_drivers']['by_department'], 
                             key=results['cost_drivers']['by_department'].get),
        'top_model': max(results['cost_drivers']['by_model'],
                        key=results['cost_drivers']['by_model'].get)
    }
    
    print("\n=== EXECUTIVE SUMMARY ===")
    print(f"  Dataset: {summary['dataset']['records']} records")
    print(f"  Total cost (sample): ${summary['metrics']['total_cost_sample']:,.2f}")
    print(f"  Potential savings: ${summary['savings']['conservative']:,.2f}/year")
    print(f"  Savings %: {(summary['savings']['conservative'] / (total_cost * 52)) * 100:.1f}%")
    
    return summary

def main():
    """Run complete analysis pipeline."""
    print("=" * 60)
    print("ENTERPRISE LLM COST OPTIMIZATION - ANALYTICAL PROOF")
    print("=" * 60)
    
    # Load data
    df = load_data(CSV_PATH)
    
    # Run analyses
    cost_drivers = analyze_cost_drivers(df)
    anomalies = detect_anomalies(df)
    model_efficiency = analyze_model_efficiency(df)
    routing_savings = calculate_routing_savings(df)
    cache_savings = calculate_cache_savings(df)
    total_savings = calculate_total_savings(routing_savings, cache_savings)
    regression = regression_analysis(df)
    
    # Compile results
    results = {
        'cost_drivers': cost_drivers,
        'anomalies': [
            {
                'week': a['week'],
                'department': a['department'],
                'spike_magnitude': a['spike_magnitude'],
                'z_score': a['z_score']
            }
            for a in anomalies[:5]  # Top 5
        ],
        'savings': total_savings,
        'regression': regression
    }
    
    # Generate summary
    summary = generate_summary(df, results)
    
    # Save results
    output = {
        'summary': summary,
        'results': results,
        'timestamp': pd.Timestamp.now().isoformat()
    }
    
    with open(OUTPUT_PATH, 'w') as f:
        json.dump(output, f, indent=2, default=str)
    
    print(f"\n✓ Results saved to {OUTPUT_PATH}")
    print("\n" + "=" * 60)
    print("ANALYSIS COMPLETE")
    print("=" * 60)

if __name__ == '__main__':
    main()
