/**
 * Financial Foresight Dashboard - Main Overview
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import FinancialHealthSnapshot from '@/components/financial-health-snapshot';
import CashFlowTimeline from '@/components/cash-flow-timeline';
import AppliedRecommendations from '@/components/applied-recommendations';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Your Financial Intelligence <span className="gradient-title">Dashboard</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          See how today&apos;s spending shapes your entire month. Simulate decisions, get smart recommendations, and plan for your future — all in one place.
        </p>
      </motion.div>

      {/* Financial Health Snapshot */}
      <section>
        <FinancialHealthSnapshot />
      </section>

      {/* Cash Flow Timeline */}
      <section>
        <CashFlowTimeline />
      </section>

      {/* Applied Recommendations */}
      <section>
        <AppliedRecommendations />
      </section>
    </div>
  );
}
