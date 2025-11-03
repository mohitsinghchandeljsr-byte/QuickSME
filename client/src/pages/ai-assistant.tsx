import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Sparkles, TrendingUp, AlertCircle, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  message: string;
  conversationHistory: Message[];
}

const suggestedQuestions = [
  "What's my current cash flow situation?",
  "Show me my top expenses this month",
  "Which stock items need reordering?",
  "What's my total revenue vs expenses?",
  "How can I improve profitability?",
  "Explain GST compliance requirements",
];

export default function AIAssistant() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; conversationHistory: Message[] }) => {
      const response = await apiRequest("POST", "/api/ai-assist", data);
      const json = await response.json();
      return json as AIResponse;
    },
    onSuccess: (data) => {
      if (data?.conversationHistory && Array.isArray(data.conversationHistory)) {
        setMessages(data.conversationHistory);
      }
      setInput("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get response from AIassist",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;

    chatMutation.mutate({
      message: input.trim(),
      conversationHistory: messages,
    });
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-600 dark:bg-blue-700">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">AIassist</h1>
            <p className="text-sm text-muted-foreground">
              Your intelligent accounting assistant
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full flex flex-col gap-4">
          {!messages || messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-2xl">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950 mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Welcome to AIassist!
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  I can help you understand your financial data, provide insights, and answer accounting questions.
                  Try asking me something below or pick a suggested question.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {suggestedQuestions.map((question, idx) => (
                    <Card
                      key={idx}
                      className="p-4 hover-elevate active-elevate-2 cursor-pointer text-left"
                      onClick={() => handleSuggestedQuestion(question)}
                      data-testid={`suggestion-${idx}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {idx < 2 && <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                          {idx >= 2 && idx < 4 && <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                          {idx >= 4 && <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                        </div>
                        <p className="text-sm text-foreground">{question}</p>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Bot className="w-3 h-3" />
                  <p>Powered by OpenAI via Replit AI Integrations</p>
                </div>
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1" ref={scrollRef}>
              <div className="space-y-4 pb-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    data-testid={`message-${idx}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        msg.role === 'user'
                          ? 'bg-blue-600 dark:bg-blue-700 text-white'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-5 h-5 text-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {chatMutation.isPending && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="max-w-[70%] rounded-lg p-4 bg-muted">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <div className="border-t border-border pt-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your accounting data..."
                disabled={chatMutation.isPending}
                data-testid="input-message"
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || chatMutation.isPending}
                data-testid="button-send"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
