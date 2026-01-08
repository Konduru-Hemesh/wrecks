"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, DollarSign, Calendar, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/apiConfig";

export default function PlannerPage() {
  const [formData, setFormData] = useState({
    monthlyIncome: "",
    currentBalance: "",
    monthlyExpenses: "",
    spendingGoal: "",
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication and load existing data
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          
          // Check if planner is already completed
          if (data.user?.plannerCompleted) {
            router.push('/dashboard');
            return;
          }
          
          // Load existing data if available
          if (data.user?.monthlyIncome) {
            setFormData({
              monthlyIncome: data.user.monthlyIncome.toString(),
              currentBalance: data.user.currentBalance?.toString() || '',
              monthlyExpenses: data.user.monthlyExpenses?.toString() || '',
              spendingGoal: data.user.spendingGoal?.toString() || '',
            });
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate all fields
      if (!formData.monthlyIncome || !formData.currentBalance || !formData.monthlyExpenses || !formData.spendingGoal) {
        toast.error('Please fill in all fields');
        setLoading(false);
        return;
      }

      // Parse and validate values
      const monthlyIncome = parseFloat(formData.monthlyIncome);
      const currentBalance = parseFloat(formData.currentBalance);
      const monthlyExpenses = parseFloat(formData.monthlyExpenses);
      const spendingGoal = parseFloat(formData.spendingGoal);

      // Validate parsed values
      if (isNaN(monthlyIncome) || isNaN(currentBalance) || isNaN(monthlyExpenses) || isNaN(spendingGoal)) {
        toast.error('Please enter valid numbers');
        setLoading(false);
        return;
      }

      // Save planner data to backend
      const updateResponse = await fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthlyIncome,
          currentBalance,
          monthlyExpenses,
          spendingGoal,
        }),
      });

      const updateData = await updateResponse.json();

      if (!updateResponse.ok) {
        toast.error(updateData.error || 'Failed to save financial details');
        setLoading(false);
        return;
      }

      toast.success('Planner setup completed!');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Planner error:', error);
      toast.error('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (isChecking) {
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-blue-500/10 to-purple-600/10 dark:from-teal-500/5 dark:via-blue-500/5 dark:to-purple-600/5 animate-gradient" />
        
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 dark:bg-teal-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 mb-6">
            <Target className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-medium text-foreground/80">
              Let's Plan Your Financial Future
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Welcome to <span className="gradient-title">SpendAhead</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us about your finances so we can help you predict and plan your spending
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glassmorphism rounded-3xl p-8 sm:p-12 shadow-2xl bg-white/90 dark:bg-gray-900/90"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Monthly Income */}
            <div>
              <label className="flex items-center gap-2 text-lg font-semibold mb-3">
                <DollarSign className="w-5 h-5 text-teal-500" />
                Monthly Income
              </label>
              <Input
                type="number"
                name="monthlyIncome"
                placeholder="e.g., 75000"
                value={formData.monthlyIncome}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="h-14 text-lg bg-background/50 transition-all duration-200 focus:bg-background"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Your total monthly income from all sources
              </p>
            </div>

            {/* Current Balance */}
            <div>
              <label className="flex items-center gap-2 text-lg font-semibold mb-3">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Current Balance
              </label>
              <Input
                type="number"
                name="currentBalance"
                placeholder="e.g., 50000"
                value={formData.currentBalance}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="h-14 text-lg bg-background/50 transition-all duration-200 focus:bg-background"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Your current account balance
              </p>
            </div>

            {/* Monthly Expenses */}
            <div>
              <label className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Calendar className="w-5 h-5 text-purple-500" />
                Average Monthly Expenses
              </label>
              <Input
                type="number"
                name="monthlyExpenses"
                placeholder="e.g., 45000"
                value={formData.monthlyExpenses}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="h-14 text-lg bg-background/50 transition-all duration-200 focus:bg-background"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Your typical monthly spending amount
              </p>
            </div>

            {/* Spending Goal */}
            <div>
              <label className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Target className="w-5 h-5 text-teal-500" />
                Monthly Spending Goal
              </label>
              <Input
                type="number"
                name="spendingGoal"
                placeholder="e.g., 40000"
                value={formData.spendingGoal}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="h-14 text-lg bg-background/50 transition-all duration-200 focus:bg-background"
              />
              <p className="text-sm text-muted-foreground mt-2">
                How much would you like to spend per month? (Your target)
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full h-14 text-lg bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 button-glow group"
            >
              {loading ? "Setting up..." : "Continue to Dashboard"}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
