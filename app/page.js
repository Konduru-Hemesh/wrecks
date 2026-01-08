"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  Shield, 
  Zap,
  Calendar,
  DollarSign,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  const [spendAmount, setSpendAmount] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [currentBalance] = useState(50000);
  const [monthlyIncome] = useState(75000);
  const [monthlyExpenses] = useState(45000);

  const handleSeeImpact = () => {
    if (spendAmount && parseFloat(spendAmount) > 0) {
      setShowPreview(true);
      setTimeout(() => {
        document.getElementById("cash-flow-preview")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  const calculateImpact = () => {
    const spend = parseFloat(spendAmount) || 0;
    const today = currentBalance - spend;
    const midMonth = today - monthlyExpenses * 0.5 + monthlyIncome * 0.5;
    const monthEnd = today - monthlyExpenses + monthlyIncome;
    
    return {
      today,
      midMonth,
      monthEnd,
      change: -spend,
      percentChange: ((spend / currentBalance) * 100).toFixed(1),
    };
  };

  const impact = calculateImpact();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-blue-500/10 to-purple-600/10 dark:from-teal-500/5 dark:via-blue-500/5 dark:to-purple-600/5 animate-gradient" />
          
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/20 dark:bg-teal-500/10 rounded-full blur-3xl"
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
          <motion.div
            className="absolute top-1/2 right-1/3 w-80 h-80 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20"
            >
              <Sparkles className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-medium text-foreground/80">
                AI-Powered Financial Intelligence
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
            >
              See how today&apos;s spending
              <br />
              <span className="gradient-title">shapes your entire month</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto"
            >
              Most apps show your balance. We show your <span className="text-foreground font-semibold">future</span>.
            </motion.p>

            {/* Interactive Spend Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-md mx-auto space-y-4 pt-8"
            >
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  ₹
                </div>
                <Input
                  type="number"
                  placeholder="Enter amount you're planning to spend"
                  value={spendAmount}
                  onChange={(e) => setSpendAmount(e.target.value)}
                  className="pl-8 h-14 text-lg bg-background/80 backdrop-blur-sm border-2 focus:border-teal-500 transition-colors"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSeeImpact();
                    }
                  }}
                />
              </div>
              <Button
                onClick={handleSeeImpact}
                size="lg"
                className="w-full h-14 text-lg bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 button-glow group"
              >
                See Impact
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-8"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-border">
                <Shield className="w-4 h-4 text-teal-500" />
                <span className="text-sm font-medium">Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-border">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Real-time Predictions</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-border">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">AI-Powered Insights</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cash Flow Preview Section */}
      <AnimatePresence>
        {showPreview && (
          <motion.section
            id="cash-flow-preview"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6 }}
            className="py-20 bg-gradient-to-b from-background to-muted/20"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  This is how a{" "}
                  <span className="gradient-title">₹{spendAmount}</span> spend
                  today changes your month
                </h2>
                <p className="text-lg text-muted-foreground">
                  Watch your balance evolve over time
                </p>
              </motion.div>

              {/* Timeline Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glassmorphism rounded-2xl p-8 card-hover"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Today
                      </p>
                      <p className="text-xs text-muted-foreground">
                        After Spending
                      </p>
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="space-y-2"
                  >
                    <p className="text-4xl font-bold gradient-title animate-count-up">
                      ₹{impact.today.toLocaleString()}
                    </p>
                    <p className="text-sm text-destructive font-medium">
                      {impact.change < 0 ? "" : "+"}₹
                      {Math.abs(impact.change).toLocaleString()} impact
                    </p>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glassmorphism rounded-2xl p-8 card-hover"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Mid-Month
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Projected Balance
                      </p>
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="space-y-2"
                  >
                    <p className="text-4xl font-bold gradient-title animate-count-up">
                      ₹{impact.midMonth.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      Normal trajectory
                    </p>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glassmorphism rounded-2xl p-8 card-hover border-2 border-teal-500/30"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center animate-pulse-glow">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Month-End
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Final Balance
                      </p>
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                    className="space-y-2"
                  >
                    <p className="text-4xl font-bold gradient-title animate-count-up">
                      ₹{impact.monthEnd.toLocaleString()}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        impact.monthEnd > currentBalance
                          ? "text-green-500"
                          : "text-amber-500"
                      }`}
                    >
                      {impact.monthEnd > currentBalance ? "Growing" : "Manageable"}
                    </p>
                  </motion.div>
                </motion.div>
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl text-lg px-8 py-6 button-glow"
                  >
                    Get Full Financial Intelligence
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <p className="mt-4 text-sm text-muted-foreground">
                  Track expenses, scan receipts with AI, and predict your financial future
                </p>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              How <span className="gradient-title">FlowCast</span> Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to understand your financial future
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Track Your Spending",
                description:
                  "Manually add expenses or scan receipts with AI. FlowCast learns your spending patterns automatically.",
                icon: DollarSign,
                gradient: "from-teal-500 to-blue-500",
              },
              {
                step: "02",
                title: "See Your Future",
                description:
                  "Our AI predicts how today's decisions impact your month-end balance with stunning visualizations.",
                icon: TrendingUp,
                gradient: "from-blue-500 to-purple-500",
              },
              {
                step: "03",
                title: "Make Better Decisions",
                description:
                  "Use what-if scenarios to test spending decisions before you make them. Never be surprised again.",
                icon: Sparkles,
                gradient: "from-purple-500 to-pink-500",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="glassmorphism rounded-2xl p-8 h-full card-hover">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-bold text-muted-foreground mb-2">
                    STEP {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">₹</span>
              </div>
              <span className="text-xl font-bold gradient-title">FlowCast</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 FlowCast. Powered by AI. Built for your future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
