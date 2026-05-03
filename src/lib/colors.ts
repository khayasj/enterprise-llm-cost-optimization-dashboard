// Enterprise color palette - Clean High-Tech Minimalism
export const colors = {
  cost: '#FF6B6B',        // Coral Red
  efficiency: '#20C997', // Teal
  neutral: '#495057',    // Slate Gray
  background: '#FFFFFF', // White
  text: {
    primary: '#212529',   // Charcoal
    secondary: '#6C757D', // Gray
    muted: '#ADB5BD',     // Light Gray
  },
  chart: {
    primary: '#FF6B6B',
    secondary: '#20C997',
    tertiary: '#4ECDC4',
    quaternary: '#FFE66D',
    quinary: '#A8DADC',
    senary: '#F1FAEE',
  },
  departments: {
    Engineering: '#FF6B6B',
    Data_Science: '#4ECDC4',
    Product: '#FFE66D',
    Customer_Support: '#20C997',
    Marketing: '#A8DADC',
    Sales: '#F1FAEE',
    Finance: '#FF8FA3',
    Legal: '#C7CEEA',
  },
  models: {
    'GPT-4': '#FF6B6B',
    'Claude-3-Opus': '#FF8FA3',
    'Gemini-Pro': '#FFE66D',
    'Claude-3-Sonnet': '#20C997',
    'GPT-3.5-Turbo': '#4ECDC4',
    'Llama-3-70B': '#A8DADC',
  },
  status: {
    high: '#FF6B6B',
    medium: '#FFE66D',
    low: '#20C997',
  }
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};
