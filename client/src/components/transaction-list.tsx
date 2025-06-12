import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  DollarSign, 
  Car, 
  Utensils, 
  Zap, 
  Film,
  Heart,
  Package 
} from "lucide-react";
import type { Transaction } from "@shared/schema";

const categoryIcons = {
  food: Utensils,
  transport: Car,
  shopping: ShoppingCart,
  utilities: Zap,
  entertainment: Film,
  healthcare: Heart,
  salary: DollarSign,
  freelance: DollarSign,
  investment: DollarSign,
  business: DollarSign,
  other: Package,
};

export default function TransactionList() {
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions", { limit: 10 }],
  });

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const formatDateTime = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (diffDays === 2) {
      return `Yesterday, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Recent Transactions</h2>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-200 rounded-full mr-3 animate-pulse"></div>
                  <div>
                    <div className="w-24 h-4 bg-slate-200 rounded animate-pulse mb-1"></div>
                    <div className="w-16 h-3 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-16 h-4 bg-slate-200 rounded animate-pulse mb-1"></div>
                  <div className="w-12 h-3 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Recent Transactions</h2>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            View All
          </Button>
        </div>
        
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">No transactions yet. Add your first transaction above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const IconComponent = categoryIcons[transaction.category as keyof typeof categoryIcons] || Package;
              const isIncome = transaction.type === 'income';
              
              return (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      isIncome ? 'bg-emerald-100' : 'bg-red-100'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        isIncome ? 'text-emerald-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800 capitalize">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-slate-500">
                        {formatDateTime(transaction.date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      isIncome ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-xs text-slate-500 capitalize">
                      {transaction.category}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
