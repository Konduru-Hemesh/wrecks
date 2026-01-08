/**
 * Goals Planning Page
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GoalsPlanning from '@/components/goals-planning';

export default function GoalsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Goals & <span className="gradient-title">Planning</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Set financial goals and track your progress. Plan for your future with confidence.
        </p>
      </motion.div>

      <GoalsPlanning />
    </div>
  );
}
