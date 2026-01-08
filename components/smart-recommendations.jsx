/**
 * Smart Recommendations Panel
 * Context-aware financial recommendations with impact and confidence
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFinancial } from '@/lib/financialContext';
import { toast } from 'sonner';
import {
  Lightbulb,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Shield,
  Target,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
} from 'lucide-react';

export default function SmartRecommendations() {
  const { recommendations, applyRecommendation, appliedRecommendations } = useFinancial();
  const [expandedRec, setExpandedRec] = useState(null);
  const [applyingId, setApplyingId] = useState(null);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'moderate':
        return <Info className="w-4 h-4 text-amber-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'spending':
        return <TrendingUp className="w-5 h-5" />;
      case 'savings':
        return <Shield className="w-5 h-5" />;
      case 'goals':
        return <Target className="w-5 h-5" />;
      case 'positive':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-500/5';
      case 'moderate':
        return 'border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5';
      case 'low':
        return 'border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-500/5';
      default:
        return 'border-border';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-blue-500';
    if (confidence >= 0.4) return 'text-amber-500';
    return 'text-red-500';
  };

  const toggleExpand = (recId) => {
    setExpandedRec(expandedRec === recId ? null : recId);
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold mb-2">Smart Recommendations</h2>
          <p className="text-muted-foreground">
            No recommendations at this time. Your finances are stable!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Smart Recommendations</h2>
        </div>
        <p className="text-muted-foreground">
          Personalized advice based on your financial state
        </p>
      </motion.div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`glassmorphism border-2 overflow-hidden ${getPriorityColor(rec.priority)}`}>
              {/* Main Content */}
              <div
                className="p-6 cursor-pointer hover:bg-background/50 transition-colors"
                onClick={() => toggleExpand(rec.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    rec.priority === 'high' ? 'bg-red-500/20' :
                    rec.priority === 'moderate' ? 'bg-amber-500/20' :
                    rec.priority === 'low' ? 'bg-blue-500/20' :
                    'bg-gray-500/20'
                  }`}>
                    {getTypeIcon(rec.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(rec.priority)}
                        <h3 className="font-semibold text-lg">{rec.title}</h3>
                      </div>
                      {expandedRec === rec.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>

                    <p className="text-muted-foreground mb-4">{rec.description}</p>

                    {/* Impact Preview */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {rec.impact.balanceChange && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-muted-foreground">Impact:</span>
                          <span className="font-semibold text-green-500">
                            +₹{Math.round(rec.impact.balanceChange).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {rec.impact.riskReduction > 0 && (
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          <span className="text-muted-foreground">Risk:</span>
                          <span className="font-semibold text-blue-500">
                            -{rec.impact.riskReduction}%
                          </span>
                        </div>
                      )}
                      {rec.impact.goalDelayDays && (
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-purple-500" />
                          <span className="text-muted-foreground">Goal:</span>
                          <span className="font-semibold text-purple-500">
                            +{rec.impact.goalDelayDays} days
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 ml-auto">
                        <Sparkles className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className={`font-semibold ${getConfidenceColor(rec.confidence)}`}>
                          {Math.round(rec.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedRec === rec.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-border"
                  >
                    <div className="p-6 bg-background/50">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Suggested Actions
                      </h4>
                      <ul className="space-y-2">
                        {rec.actions.map((action, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-3 text-sm"
                          >
                            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-muted-foreground leading-relaxed">
                              {action}
                            </span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* Detailed Impact */}
                      <div className="mt-6 p-4 rounded-lg bg-background/50 border border-border">
                        <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                          Expected Impact
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {rec.impact.balanceChange && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Balance Change</p>
                              <p className="text-lg font-bold text-green-500">
                                +₹{Math.round(rec.impact.balanceChange).toLocaleString()}
                              </p>
                            </div>
                          )}
                          {rec.impact.riskReduction > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Risk Reduction</p>
                              <p className="text-lg font-bold text-blue-500">
                                -{rec.impact.riskReduction}%
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                            <p className={`text-lg font-bold ${getConfidenceColor(rec.confidence)}`}>
                              {Math.round(rec.confidence * 100)}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full mt-4 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white"
                        onClick={async () => {
                          if (appliedRecommendations.some(ar => ar.id === rec.id)) {
                            alert('This recommendation has already been applied!');
                            return;
                          }
                          setApplyingId(rec.id);
                          try {
                            await applyRecommendation(rec);
                            toast.success(
                              `Recommendation applied! Potential savings: ₹${Math.round(rec.impact.balanceChange || 0).toLocaleString()}/month`,
                              { duration: 5000 }
                            );
                          } catch (error) {
                            toast.error('Failed to apply recommendation. Please try again.');
                          } finally {
                            setApplyingId(null);
                          }
                        }}
                        disabled={applyingId === rec.id || appliedRecommendations.some(ar => ar.id === rec.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {applyingId === rec.id 
                          ? 'Applying...' 
                          : appliedRecommendations.some(ar => ar.id === rec.id)
                          ? 'Applied ✓'
                          : 'Apply This Recommendation'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
