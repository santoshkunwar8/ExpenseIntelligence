import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current balance
  app.get("/api/balance", async (req, res) => {
    try {
      const userId = 1; // Using default user for demo
      const balance = await storage.getCurrentBalance(userId);
      res.json({ balance });
    } catch (error) {
      res.status(500).json({ message: "Failed to get balance" });
    }
  });

  // Get monthly stats
  app.get("/api/stats", async (req, res) => {
    try {
      const userId = 1;
      const stats = await storage.getMonthlyStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stats" });
    }
  });

  // Get transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const userId = 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const transactions = limit 
        ? await storage.getRecentTransactions(userId, limit)
        : await storage.getTransactionsByUserId(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get transactions" });
    }
  });

  // Create transaction
  app.post("/api/transactions", async (req, res) => {
    try {
      const userId = 1;
      const validatedData = insertTransactionSchema.parse(req.body);
      
      const transaction = await storage.createTransaction({
        ...validatedData,
        userId,
        date: validatedData.date ? new Date(validatedData.date) : new Date()
      });
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error.name === 'ZodError') {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create transaction" });
      }
    }
  });

  // Get balance history for chart
  app.get("/api/balance-history", async (req, res) => {
    try {
      const userId = 1;
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const history = await storage.getBalanceHistory(userId, days);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to get balance history" });
    }
  });

  // AI Budget Assistant
  app.post("/api/ai-assistant", async (req, res) => {
    try {
      const { message } = req.body;
      const userId = 1;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get user's financial data for context
      const balance = await storage.getCurrentBalance(userId);
      const stats = await storage.getMonthlyStats(userId);
      const recentTransactions = await storage.getRecentTransactions(userId, 10);

      // Prepare context for AI
      const financialContext = {
        currentBalance: balance,
        monthlyIncome: stats.income,
        monthlyExpenses: stats.expenses,
        transactionCount: stats.transactionCount,
        recentTransactions: recentTransactions.map(t => ({
          type: t.type,
          amount: t.amount,
          category: t.category,
          description: t.description,
          date: t.date.toISOString().split('T')[0]
        }))
      };

      const systemPrompt = `You are a personal financial advisor AI assistant. Analyze the user's financial data and provide helpful, actionable advice about budgeting, spending habits, and financial goals.

Current Financial Context:
- Current Balance: $${balance.toFixed(2)}
- This Month's Income: $${stats.income.toFixed(2)}
- This Month's Expenses: $${stats.expenses.toFixed(2)}
- Recent Transactions: ${JSON.stringify(financialContext.recentTransactions, null, 2)}

Provide personalized financial advice based on this data. Be specific, actionable, and encouraging. Focus on practical tips they can implement immediately. Respond in JSON format with the following structure:
{
  "advice": "Your main financial advice here",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "insights": "Key insights about their spending patterns"
}`;

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500
      });

      const aiResponse = JSON.parse(response.choices[0].message.content || "{}");
      res.json(aiResponse);
    } catch (error) {
      console.error("AI Assistant error:", error);
      res.status(500).json({ 
        message: "Failed to get AI response",
        advice: "I'm having trouble connecting right now. Please try again later.",
        suggestions: ["Track your daily expenses", "Set a monthly budget", "Review your spending categories"],
        insights: "Keep monitoring your financial habits for better insights."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
