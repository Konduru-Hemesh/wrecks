/**
 * What-If Simulator Page
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import WhatIfSimulator from '@/components/what-if-simulator';

export default function WhatIfPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-title">What-If</span> Simulator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Test spending decisions before you make them. See how different purchases impact your financial future.
        </p>
      </motion.div>

      <WhatIfSimulator />
    </div>
  );
}
