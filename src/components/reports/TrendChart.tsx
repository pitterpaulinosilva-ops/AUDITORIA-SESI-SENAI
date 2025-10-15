import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, Radar } from 'react-chartjs-2';
import { TrendData } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

interface TrendChartProps {
  data: TrendData[] | any[];
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'area';
  title: string;
  height?: number;
  dataKey?: string;
  xAxisKey?: string;
  yAxisKey?: string;
  colors?: string[];
  isLoading?: boolean;
}

const defaultColors = [
  '#2563eb', // blue-600
  '#16a34a', // green-600
  '#ea580c', // orange-600
  '#dc2626', // red-600
  '#9333ea', // purple-600
  '#0891b2', // cyan-600
  '#c2410c', // orange-700
  '#7c3aed'  // violet-600
];

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  type,
  title,
  height = 300,
  dataKey,
  xAxisKey = 'period',
  yAxisKey,
  colors = defaultColors,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-48 mb-4 animate-pulse"></div>
        <div className={`bg-gray-100 rounded animate-pulse`} style={{ height: `${height}px` }}>
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Carregando gráfico...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className={`bg-gray-50 rounded flex items-center justify-center`} style={{ height: `${height}px` }}>
          <div className="text-gray-500">Nenhum dado disponível</div>
        </div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            
            if (context.parsed.y !== null) {
              if (typeof context.parsed.y === 'number') {
                if (label.includes('Taxa') || label.includes('Rate')) {
                  label += context.parsed.y.toFixed(1) + '%';
                } else if (label.includes('Tempo') || label.includes('Time')) {
                  label += context.parsed.y.toFixed(1) + ' dias';
                } else {
                  label += context.parsed.y.toLocaleString('pt-BR');
                }
              } else {
                label += context.parsed.y;
              }
            }
            
            return label;
          }
        }
      }
    },
    scales: type === 'line' || type === 'bar' || type === 'area' ? {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Período'
        },
        grid: {
          display: false
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: yAxisKey ? yAxisKey : 'Valor'
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    } : undefined
  };

  const getChartData = () => {
    if (type === 'pie' || type === 'doughnut') {
      // Para gráficos de pizza, esperamos dados no formato { label: string, value: number }[]
      const labels = data.map((item: any) => item.label || item[xAxisKey]);
      const values = data.map((item: any) => item.value || item[dataKey || 'value']);
      
      return {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors.slice(0, data.length),
          borderColor: colors.slice(0, data.length).map(color => color + '80'),
          borderWidth: 2,
          hoverOffset: 4
        }]
      };
    }

    if (type === 'radar') {
      // Para gráficos de radar
      const labels = data.map((item: any) => item.label || item[xAxisKey]);
      const values = data.map((item: any) => item.value || item[dataKey || 'value']);
      
      return {
        labels,
        datasets: [{
          label: title,
          data: values,
          backgroundColor: colors[0] + '20',
          borderColor: colors[0],
          borderWidth: 2,
          pointBackgroundColor: colors[0],
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colors[0]
        }]
      };
    }

    // Para gráficos de linha, barra e área
    const labels = data.map((item: any) => item[xAxisKey]);
    
    // Se temos múltiplas séries de dados
    if (dataKey && Array.isArray(dataKey)) {
      const datasets = dataKey.map((key: string, index: number) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        data: data.map((item: any) => item[key]),
        backgroundColor: type === 'area' ? colors[index] + '20' : colors[index],
        borderColor: colors[index],
        borderWidth: 2,
        fill: type === 'area',
        tension: type === 'line' || type === 'area' ? 0.4 : 0,
        pointRadius: type === 'line' || type === 'area' ? 4 : 0,
        pointHoverRadius: type === 'line' || type === 'area' ? 6 : 0
      }));
      
      return { labels, datasets };
    }

    // Série única de dados
    const values = data.map((item: any) => {
      if (dataKey) return item[dataKey];
      // Para TrendData, usar auditsCompleted como padrão
      return item.auditsCompleted || item.value || 0;
    });

    return {
      labels,
      datasets: [{
        label: title,
        data: values,
        backgroundColor: type === 'area' ? colors[0] + '20' : colors[0],
        borderColor: colors[0],
        borderWidth: 2,
        fill: type === 'area',
        tension: type === 'line' || type === 'area' ? 0.4 : 0,
        pointRadius: type === 'line' || type === 'area' ? 4 : 0,
        pointHoverRadius: type === 'line' || type === 'area' ? 6 : 0
      }]
    };
  };

  const chartData = getChartData();

  const renderChart = () => {
    switch (type) {
      case 'line':
      case 'area':
        return <Line data={chartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={chartOptions} />;
      case 'radar':
        return <Radar data={chartData} options={chartOptions} />;
      default:
        return <Line data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
    </div>
  );
};