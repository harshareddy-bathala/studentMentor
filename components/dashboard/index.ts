/**
 * Dashboard Components Index
 * 
 * Central export file for all dashboard components.
 * Usage: import { DashboardContent, StatCard, etc. } from './components/dashboard';
 */

export { DashboardContent as default } from './DashboardContent';
export { HeroCard } from './HeroCard';
export { StatCard, CircularStatCard } from './StatCard';
export { ActionBar } from './ActionBar';
export { TodayPanel } from './TodayPanel';
export { DeadlinesCard } from './DeadlinesCard';
export { ActivitiesFeed } from './ActivitiesFeed';
export { MentorCTA, ChatDrawer } from './MentorCTA';
export { Sparkline, ProgressRing, MiniBarChart } from './Sparkline';

// Re-export types if needed
export type { default as DashboardContentType } from './DashboardContent';
