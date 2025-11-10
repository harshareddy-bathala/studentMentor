/**
 * HeroCard Component
 * 
 * Top banner with gradient background featuring:
 * - Personalized greeting
 * - Student info pills (grade, subjects)
 * - Overall progress ring (right side)
 * 
 * Updated: Uses new premium design system colors, refined spacing, and Framer Motion animations
 * 
 * Accessibility: Semantic heading structure, clickable progress ring with aria-label
 * Animation: Fade-in-up on mount (respects prefers-reduced-motion)
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div 
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-from to-primary-to p-6 md:p-8 shadow-hero"
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Decorative gradient overlay for depth */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left side: Greeting and info */}
        <div className="flex-1">
          <h1 className="text-hero-mobile md:text-hero-desktop text-white mb-2">
            Welcome back, {studentName}! 👋
          </h1>
          <p className="text-slate-200 text-body mb-4">
            Your personal growth dashboard
          </p>
          
          {/* Info pills with improved styling */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-micro font-medium">
              {grade}
            </span>
            {subjects.slice(0, 3).map((subject) => (
              <span
                key={subject.id}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-slate-100 text-micro"
              >
                {subject.name}
              </span>
            ))}
            {subjects.length > 3 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-slate-100 text-micro">
                +{subjects.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Right side: Progress ring with improved colors */}
        <div className="flex flex-col items-center gap-2">
          <ProgressRing
            percent={overallProgress}
            size={100}
            strokeWidth={8}
            color="#3DD6B8"
            label={`Overall weekly progress: ${overallProgress}%`}
            onClick={onProgressClick}
          />
          <span className="text-micro text-slate-200 font-medium">
            Weekly Progress
          </span>
        </div>
      </div>
    </motion.div>
  );
};
