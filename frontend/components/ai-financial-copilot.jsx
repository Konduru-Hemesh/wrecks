/**
 * AI Financial Copilot
 * Conversational assistant for financial questions and explanations
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFinancial } from '@/lib/financialContext';
import { MessageCircle, Send, Bot, User, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AIFinancialCopilot() {
  const { financialState, projections, riskScore, stressLevel, recommendations } = useFinancial();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your AI Financial Copilot. I can help you understand your finances in simple terms. Ask me anything like 'How is my financial health?' or 'Can I afford this expense?'",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate AI response based on user query
  const generateResponse = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Context-aware responses
    if (lowerMessage.includes('health') || lowerMessage.includes('how am i') || lowerMessage.includes('doing')) {
      const monthEndBalance = projections[projections.length - 1]?.balance || financialState.currentBalance;
      const isGrowing = monthEndBalance > financialState.currentBalance;
      
      return `Your financial health is ${stressLevel.level}. Here's what I see:\n\n` +
        `💰 Your current balance is ₹${financialState.currentBalance.toLocaleString()}. ` +
        `By month-end, it's projected to ${isGrowing ? 'grow' : 'decrease'} to ₹${Math.round(monthEndBalance).toLocaleString()}.\n\n` +
        `🎯 Your risk score is ${riskScore.score}/100, which is ${riskScore.level}. ` +
        `${stressLevel.description}.\n\n` +
        `${recommendations.length > 0 ? `💡 I have ${recommendations.length} recommendations that could help improve your situation.` : '✨ You\'re doing great! Keep up the good habits.'}`;
    }

    if (lowerMessage.includes('month end') || lowerMessage.includes('month-end')) {
      const monthEndBalance = projections[projections.length - 1]?.balance || financialState.currentBalance;
      const change = monthEndBalance - financialState.currentBalance;
      const percentChange = ((change / financialState.currentBalance) * 100).toFixed(1);

      return `Let me tell you about your month-end projection:\n\n` +
        `📊 Your balance will ${change >= 0 ? 'increase' : 'decrease'} by ₹${Math.abs(Math.round(change)).toLocaleString()} (${Math.abs(percentChange)}%).\n\n` +
        `You'll end the month with ₹${Math.round(monthEndBalance).toLocaleString()}. ` +
        `${change >= 0 ? 'That\'s great progress! You\'re spending within your means.' : 'Consider reviewing your variable expenses to improve this.'}`;
    }

    if (lowerMessage.includes('can i afford') || lowerMessage.includes('should i buy') || lowerMessage.includes('spend')) {
      return `Great question! Let me help you think through this:\n\n` +
        `🤔 Before making any purchase, use the What-If Simulator above to see the exact impact on your finances.\n\n` +
        `Here's what to consider:\n` +
        `• Will this affect your month-end balance?\n` +
        `• Does it push you into a risk zone?\n` +
        `• Will it delay any of your goals?\n\n` +
        `Remember: I'm here to help you understand the impact, not to judge your decisions. ` +
        `If you really want something, plan for it!`;
    }

    if (lowerMessage.includes('risk') || lowerMessage.includes('safe')) {
      const bufferPercentage = (financialState.currentBalance / financialState.emergencyBuffer) * 100;
      
      return `Let's talk about your financial risk:\n\n` +
        `🛡️ Your risk score is ${riskScore.score}/100. This considers:\n` +
        `• Balance adequacy: ${riskScore.breakdown.balanceAdequacy}/40\n` +
        `• Income stability: ${riskScore.breakdown.incomeStability}/30\n` +
        `• Expense predictability: ${riskScore.breakdown.expensePredictability}/20\n` +
        `• Safety margin: ${riskScore.breakdown.safetyMargin}/10\n\n` +
        `💪 Your emergency buffer is at ${Math.round(bufferPercentage)}% of target. ` +
        `${bufferPercentage >= 150 ? 'Excellent work!' : bufferPercentage >= 100 ? 'You\'re doing well!' : 'Consider building this up for more security.'}`;
    }

    if (lowerMessage.includes('goal') || lowerMessage.includes('saving')) {
      if (financialState.goals.length === 0) {
        return `I notice you haven't set any financial goals yet!\n\n` +
          `🎯 Setting goals helps you:\n` +
          `• Stay motivated to save\n` +
          `• Make better spending decisions\n` +
          `• Track your progress visually\n\n` +
          `Try adding a goal in the Goals section below. Even small goals matter!`;
      }

      const goal = financialState.goals[0];
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      const remaining = goal.targetAmount - goal.currentAmount;
      const monthsNeeded = Math.ceil(remaining / goal.monthlyContribution);

      return `Let me help you with your goals:\n\n` +
        `🎯 Your primary goal is "${goal.name}"\n` +
        `• Target: ₹${goal.targetAmount.toLocaleString()}\n` +
        `• Current: ₹${goal.currentAmount.toLocaleString()} (${Math.round(progress)}%)\n` +
        `• Monthly contribution: ₹${goal.monthlyContribution.toLocaleString()}\n\n` +
        `At this rate, you'll reach your goal in ${monthsNeeded} months. ` +
        `${monthsNeeded <= 6 ? 'You\'re making great progress!' : 'Consider increasing your monthly contribution if possible.'}`;
    }

    if (lowerMessage.includes('recommend') || lowerMessage.includes('advice') || lowerMessage.includes('suggest')) {
      if (recommendations.length === 0) {
        return `You're in great shape! I don't have any urgent recommendations right now.\n\n` +
          `✨ Keep doing what you're doing:\n` +
          `• Stay within your budget\n` +
          `• Maintain your emergency buffer\n` +
          `• Keep contributing to your goals\n\n` +
          `I'll let you know if I notice anything that needs attention.`;
      }

      const topRec = recommendations[0];
      return `I have some personalized advice for you:\n\n` +
        `💡 Top recommendation: ${topRec.title}\n\n` +
        `${topRec.description}\n\n` +
        `This could:\n` +
        `${topRec.impact.balanceChange ? `• Improve your balance by ₹${Math.round(topRec.impact.balanceChange).toLocaleString()}\n` : ''}` +
        `${topRec.impact.riskReduction ? `• Reduce your risk by ${topRec.impact.riskReduction}%\n` : ''}` +
        `\nCheck the Smart Recommendations section below for more details!`;
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
      return `I'm here to help you understand your finances! Here's what I can do:\n\n` +
        `💬 Ask me about:\n` +
        `• Your financial health\n` +
        `• Month-end projections\n` +
        `• Whether you can afford something\n` +
        `• Your risk level\n` +
        `• Your goals and progress\n` +
        `• Personalized recommendations\n\n` +
        `I explain everything in simple terms, without judgment. ` +
        `My goal is to help you make informed decisions about your money.`;
    }

    // Default response for unrecognized queries
    return `I want to help, but I'm not sure I understood your question.\n\n` +
      `Try asking me about:\n` +
      `• "How is my financial health?"\n` +
      `• "What will my month-end balance be?"\n` +
      `• "Can I afford to spend ₹5000?"\n` +
      `• "What are my recommendations?"\n` +
      `• "How are my goals doing?"\n\n` +
      `Or just tell me what's on your mind about your finances!`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate AI thinking
    setTimeout(async () => {
      const response = await generateResponse(input);
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl button-glow"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md"
          >
            <Card className="glassmorphism border-2 border-purple-500/30 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Financial Copilot</h3>
                      <p className="text-xs text-white/80">Always here to help</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4 bg-background/50">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex gap-2 max-w-[80%] ${
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                            : 'bg-gradient-to-br from-purple-500 to-purple-600'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-muted rounded-2xl p-3">
                        <div className="flex gap-1">
                          <motion.div
                            className="w-2 h-2 bg-purple-500 rounded-full"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-purple-500 rounded-full"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-purple-500 rounded-full"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-background">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isThinking) {
                        handleSend();
                      }
                    }}
                    placeholder="Ask me anything about your finances..."
                    className="flex-1"
                    disabled={isThinking}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isThinking}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  I explain finances in simple terms, without judgment
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
