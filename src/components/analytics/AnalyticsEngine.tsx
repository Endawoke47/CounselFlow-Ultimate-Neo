import React from 'react';
import { dataManager, ChartData } from '../../data';
import { 
  TrendingUpIcon, 
  TrendingDownIcon
} from '../icons';

// Simple Chart Components (since we don't have chart libraries)
interface ChartProps {
  data: ChartData;
  height?: number;
  width?: number;
}

export const BarChart: React.FC<ChartProps> = ({ data, height = 300, width = 400 }) => {
  const maxValue = Math.max(...data.data.map(d => d[data.yAxis!]));
  const barWidth = 40;
  const barSpacing = 10;
  const chartWidth = data.data.length * (barWidth + barSpacing);
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{data.title}</h3>
      <div className="relative" style={{ height, width: Math.min(width, chartWidth + 60) }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth + 60} ${height}`}>
          {/* Y-axis */}
          <line x1="40" y1="20" x2="40" y2={height - 40} stroke="#e5e7eb" strokeWidth="2" />
          
          {/* X-axis */}
          <line x1="40" y1={height - 40} x2={chartWidth + 40} y2={height - 40} stroke="#e5e7eb" strokeWidth="2" />
          
          {/* Bars */}
          {data.data.map((item, index) => {
            const barHeight = (item[data.yAxis!] / maxValue) * (height - 80);
            const x = 50 + index * (barWidth + barSpacing);
            const y = height - 40 - barHeight;
            
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#14b8a6"
                  className="hover:fill-teal-700 transition-colors cursor-pointer"
                />
                <text
                  x={x + barWidth / 2}
                  y={height - 20}
                  textAnchor="middle"
                  className="text-sm fill-gray-600"
                >
                  {item[data.xAxis!]}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-700"
                >
                  {item[data.yAxis!]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export const PieChart: React.FC<ChartProps> = ({ data, height = 300, width = 300 }) => {
  const total = data.data.reduce((sum, item) => sum + item.count, 0);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40;
  
  let currentAngle = 0;
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{data.title}</h3>
      <div className="flex items-center justify-center">
        <div className="relative" style={{ height, width }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
            {data.data.map((item, index) => {
              const percentage = item.count / total;
              const angle = percentage * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              
              const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
              const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
              const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
              const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              currentAngle += angle;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={data.colors?.[index] || '#14b8a6'}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>
        <div className="ml-8">
          <div className="space-y-2">
            {data.data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: data.colors?.[index] || '#14b8a6' }}
                />
                <span className="text-sm text-gray-700">
                  {item.status || item.severity} ({item.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const LineChart: React.FC<ChartProps> = ({ data, height = 300, width = 400 }) => {
  const maxValue = Math.max(...data.data.map(d => d[data.yAxis!]));
  const minValue = Math.min(...data.data.map(d => d[data.yAxis!]));
  const range = maxValue - minValue;
  const stepX = (width - 80) / (data.data.length - 1);
  
  const points = data.data.map((item, index) => {
    const x = 40 + index * stepX;
    const y = height - 40 - ((item[data.yAxis!] - minValue) / range) * (height - 80);
    return { x, y, value: item[data.yAxis!], label: item[data.xAxis!] };
  });
  
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{data.title}</h3>
      <div className="relative" style={{ height, width }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((fraction, index) => (
            <line
              key={index}
              x1="40"
              y1={40 + fraction * (height - 80)}
              x2={width - 40}
              y2={40 + fraction * (height - 80)}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis */}
          <line x1="40" y1="20" x2="40" y2={height - 40} stroke="#e5e7eb" strokeWidth="2" />
          
          {/* X-axis */}
          <line x1="40" y1={height - 40} x2={width - 40} y2={height - 40} stroke="#e5e7eb" strokeWidth="2" />
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#14b8a6"
            strokeWidth="3"
            className="hover:stroke-teal-700 transition-colors"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#14b8a6"
                className="hover:fill-teal-700 transition-colors cursor-pointer"
              />
              <text
                x={point.x}
                y={height - 20}
                textAnchor="middle"
                className="text-sm fill-gray-600"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

// Analytics Dashboard Component
export const AnalyticsDashboard: React.FC = () => {
  const metrics = dataManager.getAnalyticsMetrics();
  const chartData = dataManager.getChartData();
  
  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.category === 'financial' ? `$${metric.value.toLocaleString()}` : metric.value}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {metric.trend === 'up' ? (
                  <TrendingUpIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDownIcon className="h-5 w-5 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartData.map((chart) => (
          <div key={chart.id}>
            {chart.type === 'bar' && <BarChart data={chart} />}
            {chart.type === 'pie' && <PieChart data={chart} />}
            {chart.type === 'donut' && <PieChart data={chart} />}
            {chart.type === 'line' && <LineChart data={chart} />}
          </div>
        ))}
      </div>
    </div>
  );
};

// Risk Analytics Component
export const RiskAnalytics: React.FC = () => {
  const risks = dataManager.getRisks();
  const riskMetrics = {
    total: risks.length,
    critical: risks.filter(r => r.severity === 'Critical').length,
    high: risks.filter(r => r.severity === 'High').length,
    medium: risks.filter(r => r.severity === 'Medium').length,
    low: risks.filter(r => r.severity === 'Low').length
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{riskMetrics.total}</div>
            <div className="text-sm text-gray-500">Total Risks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{riskMetrics.critical}</div>
            <div className="text-sm text-gray-500">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{riskMetrics.high}</div>
            <div className="text-sm text-gray-500">High</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{riskMetrics.medium}</div>
            <div className="text-sm text-gray-500">Medium</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{riskMetrics.low}</div>
            <div className="text-sm text-gray-500">Low</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Details</h3>
        <div className="space-y-4">
          {risks.map((risk) => (
            <div key={risk.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{risk.description}</h4>
                  <p className="text-sm text-gray-600 mt-1">Owner: {risk.owner}</p>
                  <p className="text-sm text-gray-600">Due: {risk.dueDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    risk.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                    risk.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                    risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {risk.severity}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    risk.impact === 'Critical' ? 'bg-red-100 text-red-800' :
                    risk.impact === 'High' ? 'bg-orange-100 text-orange-800' :
                    risk.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {risk.impact} Impact
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Mitigation:</span> {risk.mitigationPlan}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Financial Analytics Component
export const FinancialAnalytics: React.FC = () => {
  const contracts = dataManager.getContracts();
  const spend = dataManager.getSpend();
  
  const totalContractValue = contracts.reduce((sum, contract) => sum + contract.contractValue_USD, 0);
  const totalSpend = spend.reduce((sum, item) => {
    if (item.currency === 'USD') return sum + item.amountPaid;
    if (item.currency === 'NGN') return sum + (item.amountPaid / 1500); // Approximate conversion
    if (item.currency === 'ZAR') return sum + (item.amountPaid / 15); // Approximate conversion
    return sum;
  }, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Contract Value</h3>
          <p className="text-3xl font-bold text-teal-600">${totalContractValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Legal Spend</h3>
          <p className="text-3xl font-bold text-blue-600">${totalSpend.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Spend per Matter</h3>
          <p className="text-3xl font-bold text-green-600">${(totalSpend / spend.length).toLocaleString()}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend by Vendor</h3>
        <div className="space-y-3">
          {spend.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{item.vendor}</p>
                <p className="text-sm text-gray-600">Matter: {item.matter}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {item.currency} {item.amountPaid.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Score: {item.performanceScore}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;