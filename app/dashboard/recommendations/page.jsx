/**
 * Smart Recommendations Page
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SmartRecommendations from '@/components/smart-recommendations';

export default function RecommendationsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Smart <span className="gradient-title">Recommendations</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Personalized, AI-powered financial advice tailored to your spending patterns and goals.
        </p>
      </motion.div>

      <SmartRecommendations />
    </div>
  );
}
