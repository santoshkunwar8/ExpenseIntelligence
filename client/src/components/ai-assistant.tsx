import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Sparkles, Send, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AIResponse {
  advice: string;
  suggestions: string[];
  insights: string;
}

export default function AIAssistant() {
  const [message, setMessage] = useState("");
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const { toast } = useToast();

  const aiMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const response = await apiRequest("POST", "/api/ai-assistant", { message: userMessage });
      return response.json();
    },
    onSuccess: (data: AIResponse) => {
      setAiResponse(data);
      setMessage("");
    },
    onError: (error: any) => {
      toast({
        title: "AI Assistant Error",
        description: error.message || "Failed to get AI response",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    aiMutation.mutate(message);
  };

  const handleQuickAction = (action: string) => {
    let prompt = "";
    switch (action) {
      case "analyze":
        prompt = "Please analyze my spending patterns and give me insights about where I can improve.";
        break;
      case "budget":
        prompt = "Can you suggest a budget plan based on my current income and expenses?";
        break;
      case "savings":
        prompt = "What are some practical tips to help me save more money each month?";
        break;
      default:
        return;
    }
    aiMutation.mutate(prompt);
  };

  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">AI Budget Assistant</h2>
            <p className="text-sm text-slate-600">Get personalized financial insights</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Initial AI Suggestion */}
          {!aiResponse && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 mb-3">
                    I'm here to help you understand your spending patterns and make better financial decisions. 
                    Ask me anything about your budget!
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleQuickAction("analyze")}
                      disabled={aiMutation.isPending}
                    >
                      Analyze spending
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleQuickAction("budget")}
                      disabled={aiMutation.isPending}
                    >
                      Budget suggestions
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleQuickAction("savings")}
                      disabled={aiMutation.isPending}
                    >
                      Savings tips
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Response */}
          {aiResponse && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-slate-700 mb-3">
                    <p className="mb-3">{aiResponse.advice}</p>
                    
                    {aiResponse.suggestions && aiResponse.suggestions.length > 0 && (
                      <div className="mb-3">
                        <p className="font-medium mb-2">Suggestions:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {aiResponse.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm">{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {aiResponse.insights && (
                      <div>
                        <p className="font-medium mb-2">Key Insights:</p>
                        <p className="text-sm">{aiResponse.insights}</p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => setAiResponse(null)}
                  >
                    Ask another question
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              placeholder="Ask me anything about your budget, spending habits, or financial goals..."
              className="resize-none"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={aiMutation.isPending}
            />
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={aiMutation.isPending || !message.trim()}
            >
              {aiMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  AI is thinking...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Ask AI Assistant
                </>
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
