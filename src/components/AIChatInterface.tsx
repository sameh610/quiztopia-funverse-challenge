
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, Plus, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatInterfaceProps {
  onGenerateQuestions: (questions: any[]) => void;
}

const AIChatInterface = ({ onGenerateQuestions }: AIChatInterfaceProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartChat = () => {
    if (!topic.trim()) {
      toast({
        title: "Please enter a topic",
        description: "A topic is needed to start the AI chat",
        variant: "destructive",
      });
      return;
    }
    
    setChatStarted(true);
    setMessages([
      {
        role: "assistant",
        content: `I'll help you create quiz questions about "${topic}". What kind of questions would you like to create? You can ask for multiple-choice, true/false, fill-in-the-blank, or other question types.`
      }
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMessage];
      
      // Call OpenRouter API with the Qwen2.5 VL 72B model
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_API_KEY" // Should use a proper secret management
        },
        body: JSON.stringify({
          model: "qwen/qwen2.5-vl-72b-instruct",
          messages: chatHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      const assistantMessage = { 
        role: "assistant", 
        content: data.choices[0].message.content 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error communicating with AI:", error);
      toast({
        title: "Error",
        description: "Failed to communicate with the AI. Please try again.",
        variant: "destructive",
      });
      
      // Mock response for development
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting to the AI service right now. Please enter your API key or try again later. In the meantime, here's a sample question about your topic:\n\nWhat is the capital of France?\nA) London\nB) Paris\nC) Berlin\nD) Madrid\n\nCorrect answer: B) Paris"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = () => {
    // Extract questions from the conversation
    // This is a simplified implementation
    const sampleQuestions = [
      {
        id: "q1",
        type: "multiple-choice" as const,
        question: "What is the capital of France?",
        options: ["London", "Paris", "Berlin", "Madrid"],
        correctAnswer: 1
      },
      {
        id: "q2",
        type: "true-false" as const,
        question: "The Eiffel Tower is located in London.",
        options: ["True", "False"],
        correctAnswer: false
      }
    ];
    
    toast({
      title: "Quiz Generated",
      description: `Created ${sampleQuestions.length} questions based on your conversation`,
    });
    
    onGenerateQuestions(sampleQuestions);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (chatStarted) {
        handleSendMessage();
      } else {
        handleStartChat();
      }
    }
  };

  const handleReset = () => {
    setMessages([]);
    setTopic("");
    setChatStarted(false);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>AI Quiz Creator</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto mb-4">
        {!chatStarted ? (
          <div className="space-y-4">
            <div className="text-center p-6">
              <Bot className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Chat with Qwen AI</h3>
              <p className="text-muted-foreground mb-4">
                Start by entering a topic, then chat with the AI to create customized quiz questions.
              </p>
            </div>
            <div className="space-y-2">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic (e.g. World Geography, History, Science)"
                onKeyDown={handleKeyDown}
              />
              <Button onClick={handleStartChat} className="w-full">
                Start Chat
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        {chatStarted ? (
          <div className="flex flex-col w-full space-y-2">
            <div className="flex space-x-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow resize-none"
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon" 
                disabled={isLoading || !inputMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleReset}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={handleGenerateQuiz}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Quiz
              </Button>
            </div>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default AIChatInterface;
