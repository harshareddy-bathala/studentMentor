/**
 * HeroCard Component
 * 
 * Top banner with gradient background featuring:
 * - Personalized greeting
 * - Student info pills (grade, subjects)
 * - Overall progress ring (right side)
 * 
 * Accessibility: Semantic heading structure, clickable progress ring with aria-label
 */

import React from 'react';
import { ProgressRing } from './Sparkline';

interface HeroCardProps {
  studentName: string;
  grade: string;
  subjects: Array<{ id: string; name: string }>;
  overallProgress: number;
  onProgressClick?: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  studentName,
  grade,
  subjects,
  overallProgress,
  onProgressClick
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2B2F7A] to-[#6C4AB6] p-6 md:p-8 shadow-lg">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left side: Greeting and info */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, {studentName}! 👋
          </h1>
          <p className="text-purple-200 text-sm md:text-base mb-4">
            Your personal growth dashboard
          </p>
          
          {/* Info pills */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
              {grade}
            </span>
            {subjects.slice(0, 3).map((subject) => (
              <span
                key={subject.id}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-purple-100 text-xs"
              >
                {subject.name}
              </span>
            ))}
            {subjects.length > 3 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-purple-100 text-xs">
                +{subjects.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Right side: Progress ring */}
        <div className="flex flex-col items-center gap-2">
          <ProgressRing
            percent={overallProgress}
            size={100}
            strokeWidth={8}
            color="#3DD6B8"
            label={`Overall weekly progress: ${overallProgress}%`}
            onClick={onProgressClick}
          />
          <span className="text-xs text-purple-200 font-medium">
            Weekly Progress
          </span>
        </div>
      </div>
    </div>
  );
};
