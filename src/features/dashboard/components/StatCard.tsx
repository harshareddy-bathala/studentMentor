/**
 * StatCard Component
 * 
 * Reusable card for displaying key metrics with:
 * - Icon/emoji
 * - Title and primary metric
 * - Micro-copy (subtitle)
 * - Optional sparkline or mini chart
 * - Chevron for expansion
 * 
 * Updated: Added Framer Motion stagger animations
 * 
 * Accessibility: Button role for interactive cards, aria-labels
 * Animation: Fade-in with stagger delay (respects prefers-reduced-motion)
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkline, MiniBarChart } from './Sparkline';

interface StatCardProps {
  icon: string;
  title: string;
  value: string | number;
  subtitle: string;
  trend?: number[]; // Optional sparkline data
  barData?: number[]; // Optional bar chart data
  trendLabel?: string;
  statusColor?: 'green' | 'yellow' | 'red' | 'blue';
  onClick?: () => void;
  changePercent?: number; // e.g., +12 or -5
  delay?: number; // Animation delay for stagger effect
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  barData,
  trendLabel,
  statusColor = 'blue',
  onClick,
  changePercent,
  delay = 0
}) => {
  const shouldReduceMotion = useReducedMotion();

  const colorClasses = {
    green: 'text-[#3DD6B8]',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    blue: 'text-blue-400'
  };

  const bgColorClasses = {
    green: 'bg-[#3DD6B8]/10',
    yellow: 'bg-yellow-400/10',
    red: 'bg-red-400/10',
    blue: 'bg-blue-400/10'
  };

  const MotionComponent = motion[onClick ? 'button' : 'div'] as any;

  return (
    <MotionComponent
      onClick={onClick}
      className={`relative bg-slate-800 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-400' : ''
      }`}
      {...(onClick && { type: 'button', 'aria-label': `View details for ${title}` })}
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
    >
      {/* Icon badge */}
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${bgColorClasses[statusColor]} mb-3`}>
        <span className="text-xl">{icon}</span>
      </div>

      {/* Title and value */}
      <h3 className="text-sm font-medium text-slate-400 mb-1">{title}</h3>
      <div className="flex items-baseline gap-2 mb-2">
        <p className={`text-2xl font-bold ${colorClasses[statusColor]}`}>
          {value}
        </p>
        {changePercent !== undefined && (
          <span
            className={`text-xs font-medium ${
              changePercent > 0 ? 'text-green-400' : changePercent < 0 ? 'text-red-400' : 'text-slate-400'
            }`}
          >
            {changePercent > 0 ? '↑' : changePercent < 0 ? '↓' : '→'} {Math.abs(changePercent)}%
          </span>
        )}
      </div>

      {/* Subtitle */}
      <p className="text-xs text-slate-500 mb-3">{subtitle}</p>

      {/* Trend visualization */}
      {trend && trend.length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          <Sparkline
            data={trend}
            width={80}
            height={24}
            color={statusColor === 'green' ? '#3DD6B8' : statusColor === 'red' ? '#F87171' : '#6C4AB6'}
            label={trendLabel || `${title} trend over last 7 days`}
          />
          <span className="text-xs text-slate-600">7 days</span>
        </div>
      )}

      {/* Bar chart */}
      {barData && barData.length > 0 && (
        <div className="flex items-end gap-1 mb-2">
          <MiniBarChart
            data={barData}
            maxHeight={32}
            barWidth={8}
            gap={3}
            color="#6C4AB6"
            label={trendLabel || `${title} weekly distribution`}
          />
        </div>
      )}

      {/* Chevron for clickable cards */}
      {onClick && (
        <div className="absolute top-5 right-5 text-slate-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </MotionComponent>
  );
};

/**
 * CircularStatCard Component
 * 
 * Card variant with circular progress indicator
 */

interface CircularStatCardProps {
  icon: string;
  title: string;
  percent: number;
  subtitle: string;
  statusColor?: 'green' | 'yellow' | 'red' | 'blue';
  onClick?: () => void;
}

export const CircularStatCard: React.FC<CircularStatCardProps> = ({
  icon,
  title,
  percent,
  subtitle,
  statusColor = 'green',
  onClick
}) => {
  const colorMap = {
    green: '#3DD6B8',
    yellow: '#FBBF24',
    red: '#F87171',
    blue: '#60A5FA'
  };

  const bgColorClasses = {
    green: 'bg-[#3DD6B8]/10',
    yellow: 'bg-yellow-400/10',
    red: 'bg-red-400/10',
    blue: 'bg-blue-400/10'
  };

  return (
    <button
      onClick={onClick}
      className="relative bg-slate-800 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-400 text-left w-full"
      type="button"
      aria-label={`View details for ${title}`}
    >
      {/* Icon badge */}
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${bgColorClasses[statusColor]} mb-3`}>
        <span className="text-xl">{icon}</span>
      </div>

      <h3 className="text-sm font-medium text-slate-400 mb-3">{title}</h3>

      {/* Circular progress */}
      <div className="flex items-center gap-4 mb-3">
        <svg width="60" height="60" className="transform -rotate-90">
          <circle
            cx="30"
            cy="30"
            r="26"
            stroke="#2D3748"
            strokeWidth="5"
            fill="none"
          />
          <circle
            cx="30"
            cy="30"
            r="26"
            stroke={colorMap[statusColor]}
            strokeWidth="5"
            fill="none"
            strokeDasharray={`${(percent / 100) * 163.36} 163.36`}
            strokeLinecap="round"
          />
          <text
            x="30"
            y="30"
            textAnchor="middle"
            dy="7"
            className="text-sm font-bold fill-white transform rotate-90"
            style={{ transform: 'rotate(90deg)', transformOrigin: '30px 30px' }}
          >
            {percent}%
          </text>
        </svg>
        
        <div className="flex-1">
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
    </button>
  );
};
