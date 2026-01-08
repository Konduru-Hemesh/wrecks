/**
 * Financial Foresight Dashboard
 * Main dashboard integrating all financial intelligence features
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FinancialProvider } from '@/lib/financialContext';
import FinancialHealthSnapshot from '@/components/financial-health-snapshot';
import CashFlowTimeline from '@/components/cash-flow-timeline';
import WhatIfSimulator from '@/components/what-if-simulator';
import SmartRecommendations from '@/components/smart-recommendations';
import AIFinancialCopilot from '@/components/ai-financial-copilot';
import GoalsPlanning from '@/components/goals-planning';

function DashboardContent() {
  const router = useRouter();

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">₹</span>
              </div>
              <span className="text-xl font-bold gradient-title">SpendAhead</span>
            </Link>
            
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
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

        {/* What-If Simulator - MOST IMPORTANT */}
        <section className="scroll-mt-20" id="what-if">
          <WhatIfSimulator />
        </section>

        {/* Smart Recommendations */}
        <section>
          <SmartRecommendations />
        </section>

        {/* Goals & Future Planning */}
        <section>
          <GoalsPlanning />
        </section>
      </div>

      {/* AI Financial Copilot - Floating */}
      <AIFinancialCopilot />

      {/* Footer */}
      <footer className="py-12 border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">₹</span>
              </div>
              <span className="text-xl font-bold gradient-title">SpendAhead</span>
            </div>
              <p className="text-sm text-muted-foreground">
              © 2024 SpendAhead. Future-first financial intelligence. Built for your peace of mind.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <FinancialProvider>
      <DashboardContent />
    </FinancialProvider>
  );
}
