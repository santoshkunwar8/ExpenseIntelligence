import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ArrowUp, ArrowDown, TrendingUp, Bell, ChartLine } from "lucide-react";
import TransactionForm from "@/components/transaction-form";
import TransactionList from "@/components/transaction-list";
import BalanceChart from "@/components/balance-chart";
import AIAssistant from "@/components/ai-assistant";

export default function Dashboard() {
  const { data: balance = 0 } = useQuery({
    queryKey: ["/api/balance"],
  });

  const { data: stats = { income: 0, expenses: 0, transactionCount: 0 } } = useQuery({
    queryKey: ["/api/stats"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const balanceChange = stats.income - stats.expenses;
  const balanceChangePercent = balance > 0 ? (balanceChange / balance) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChartLine className="text-2xl text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-slate-800">ExpenseFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-500 hover:text-slate-700 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Current Balance Card */}
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600">Current Balance</h3>
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-slate-800">
                {formatCurrency(balance)}
              </div>
              <div className="flex items-center mt-2">
                {balanceChange >= 0 ? (
                  <ArrowUp className="w-4 h-4 text-emerald-500 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${balanceChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {balanceChangePercent > 0 ? '+' : ''}{balanceChangePercent.toFixed(1)}% from last month
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Total Income Card */}
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600">This Month Income</h3>
                <ArrowUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                {formatCurrency(stats.income)}
              </div>
              <div className="text-sm text-slate-500 mt-2">
                {stats.transactionCount} transactions
              </div>
            </CardContent>
          </Card>

          {/* Total Expenses Card */}
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600">This Month Expenses</h3>
                <ArrowDown className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-red-500">
                {formatCurrency(stats.expenses)}
              </div>
              <div className="text-sm text-slate-500 mt-2">
                {stats.transactionCount} transactions
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* Add Transaction Form */}
            <TransactionForm />

            {/* Recent Transactions */}
            <TransactionList />
          </div>

          <div className="space-y-8">
            {/* Balance Chart */}
            <BalanceChart />

            {/* AI Budget Assistant */}
            <AIAssistant />

            {/* Quick Stats */}
            <Card className="p-6">
              <CardContent className="p-0">
                <h2 className="text-lg font-semibold text-slate-800 mb-6">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                      <span className="text-sm text-slate-600">Average Daily Income</span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency(stats.income / 30)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-sm text-slate-600">Average Daily Spending</span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency(stats.expenses / 30)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm text-slate-600">Net Monthly Change</span>
                    </div>
                    <span className={`font-semibold ${balanceChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {formatCurrency(balanceChange)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-sm text-slate-600">Transactions This Month</span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {stats.transactionCount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
