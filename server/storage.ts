import { users, transactions, type User, type InsertUser, type Transaction, type InsertTransaction } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Transaction methods
  createTransaction(transaction: InsertTransaction & { userId: number }): Promise<Transaction>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  getRecentTransactions(userId: number, limit?: number): Promise<Transaction[]>;
  getCurrentBalance(userId: number): Promise<number>;
  getMonthlyStats(userId: number): Promise<{
    income: number;
    expenses: number;
    transactionCount: number;
  }>;
  getBalanceHistory(userId: number, days?: number): Promise<Array<{
    date: string;
    balance: number;
  }>>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Map<number, Transaction>;
  private currentUserId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.currentUserId = 1;
    this.currentTransactionId = 1;
    
    // Create a default user for demo purposes
    this.users.set(1, {
      id: 1,
      username: "demo",
      password: "demo"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createTransaction(transactionData: InsertTransaction & { userId: number }): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      id,
      type: transactionData.type,
      amount: transactionData.amount,
      description: transactionData.description,
      category: transactionData.category,
      date: transactionData.date ? new Date(transactionData.date) : new Date(),
      userId: transactionData.userId,
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getRecentTransactions(userId: number, limit: number = 10): Promise<Transaction[]> {
    const userTransactions = await this.getTransactionsByUserId(userId);
    return userTransactions.slice(0, limit);
  }

  async getCurrentBalance(userId: number): Promise<number> {
    const userTransactions = await this.getTransactionsByUserId(userId);
    return userTransactions.reduce((balance, transaction) => {
      const amount = parseFloat(transaction.amount);
      return transaction.type === 'income' 
        ? balance + amount 
        : balance - amount;
    }, 0);
  }

  async getMonthlyStats(userId: number): Promise<{
    income: number;
    expenses: number;
    transactionCount: number;
  }> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const userTransactions = await this.getTransactionsByUserId(userId);
    const monthlyTransactions = userTransactions.filter(
      transaction => transaction.date >= startOfMonth
    );

    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return {
      income,
      expenses,
      transactionCount: monthlyTransactions.length
    };
  }

  async getBalanceHistory(userId: number, days: number = 30): Promise<Array<{
    date: string;
    balance: number;
  }>> {
    const userTransactions = await this.getTransactionsByUserId(userId);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Sort transactions by date (oldest first)
    const sortedTransactions = userTransactions
      .filter(t => t.date >= startDate)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const balanceHistory: Array<{ date: string; balance: number }> = [];
    let runningBalance = 0;

    // Calculate initial balance from transactions before the start date
    const earlierTransactions = userTransactions.filter(t => t.date < startDate);
    runningBalance = earlierTransactions.reduce((balance, transaction) => {
      const amount = parseFloat(transaction.amount);
      return transaction.type === 'income' ? balance + amount : balance - amount;
    }, 0);

    // Generate daily balance points
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayTransactions = sortedTransactions.filter(t => 
        t.date.toDateString() === d.toDateString()
      );

      // Apply transactions for this day
      dayTransactions.forEach(transaction => {
        const amount = parseFloat(transaction.amount);
        runningBalance += transaction.type === 'income' ? amount : -amount;
      });

      balanceHistory.push({
        date: d.toISOString().split('T')[0],
        balance: runningBalance
      });
    }

    return balanceHistory;
  }
}

export const storage = new MemStorage();
