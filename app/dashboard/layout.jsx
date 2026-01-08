'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/apiConfig';
import { FinancialProvider } from '@/lib/financialContext';
import DashboardNavbar from '@/components/dashboard-navbar';
import AIFinancialCopilot from '@/components/ai-financial-copilot';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: 'include',
        });
        if (response.ok) {
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('google_auth') === 'true') {
            window.history.replaceState({}, '', window.location.pathname);
            toast.success('Logged in with Google!');
          }

          const plannerCompleted = localStorage.getItem('plannerCompleted');
          if (plannerCompleted !== 'true') {
            router.push('/planner');
            return;
          }
          setIsAuthenticated(true);
        } else {
          toast.error('Please login to access the dashboard');
          router.push('/login');
        }
      } catch (error) {
        toast.error('Please login to access the dashboard');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <FinancialProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <DashboardNavbar />
        <main className="flex-1">
          {children}
        </main>
        <AIFinancialCopilot />
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
    </FinancialProvider>
  );
}
