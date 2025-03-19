
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, Plus, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ApiKeyInput from "@/components/ApiKeyInput";

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
  const [apiKey, setApiKey] = useState<string>(() => {
    // Try to load from localStorage on component mount
    return localStorage.getItem("openrouter_api_key") || "";
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Save API key to localStorage whenever it changes
    if (apiKey) {
      localStorage.setItem("openrouter_api_key", apiKey);
    }
  }, [apiKey]);

  const handleStartChat = () => {
    if (!topic.trim()) {
      toast({
        title: "Please enter a topic",
        description: "A topic is needed to start the AI chat",
        variant: "destructive",
      });
      return;
    }
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenRouter API key first",
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
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenRouter API key first",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = { role: "user", content: inputMessage };
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
          "Authorization": `Bearer ${apiKey}`
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
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(`Failed to get response from AI: ${response.status} ${errorData?.error?.message || ""}`);
      }

      const data = await response.json();
      const assistantMessage: Message = { 
        role: "assistant", 
        content: data.choices[0].message.content 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error communicating with AI:", error);
      toast({
        title: "Error",
        description: "Failed to communicate with the AI. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = () => {
    if (messages.length < 2) {
      toast({
        title: "More conversation needed",
        description: "Please chat with the AI a bit more to generate better quiz questions",
        variant: "destructive",
      });
      return;
    }
    
    // Extract suitable questions from the conversation
    const extractedQuestions = parseQuestionsFromMessages(messages);
    
    if (extractedQuestions.length > 0) {
      toast({
        title: "Quiz Generated",
        description: `Created ${extractedQuestions.length} questions based on your conversation`,
      });
      
      onGenerateQuestions(extractedQuestions);
    } else {
      toast({
        title: "No questions found",
        description: "Couldn't extract questions from the conversation. Try asking the AI to create some specific questions.",
        variant: "destructive",
      });
    }
  };

  // Helper function to try to extract quiz questions from the AI's responses
  const parseQuestionsFromMessages = (messages: Message[]): any[] => {
    const assistantMessages = messages.filter(m => m.role === "assistant");
    const questions: any[] = [];
    
    // Very simple parsing logic - this could be improved with more sophisticated parsing
    assistantMessages.forEach((message, index) => {
      const content = message.content;
      
      // Look for patterns that might indicate multiple choice questions
      // This is a very simple implementation
      const mcQuestionMatches = content.match(/(\d+\.\s.*\?)\s*[A-D]\)\s*(.*)\s*[A-D]\)\s*(.*)\s*[A-D]\)\s*(.*)\s*[A-D]\)\s*(.*)/g);
      
      if (mcQuestionMatches) {
        mcQuestionMatches.forEach(match => {
          const questionMatch = match.match(/(\d+\.\s*)(.*?)(?=\s*A\))/s);
          const optionsMatch = match.match(/A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*?)(?:\s|$)/s);
          
          if (questionMatch && optionsMatch) {
            questions.push({
              id: `q${questions.length + 1}`,
              type: "multiple-choice",
              question: questionMatch[2].trim(),
              options: [
                optionsMatch[1].trim(),
                optionsMatch[2].trim(), 
                optionsMatch[3].trim(),
                optionsMatch[4].trim()
              ],
              correctAnswer: 0 // Default to first option
            });
          }
        });
      }
      
      // Look for true/false questions
      const tfQuestionMatches = content.match(/(\d+\.\s.*\?)\s*(?:True|False)/g);
      
      if (tfQuestionMatches) {
        tfQuestionMatches.forEach(match => {
          const questionMatch = match.match(/(\d+\.\s*)(.*?)(?=\s*True|False)/s);
          
          if (questionMatch) {
            questions.push({
              id: `q${questions.length + 1}`,
              type: "true-false",
              question: questionMatch[2].trim(),
              options: ["True", "False"],
              correctAnswer: false // Default
            });
          }
        });
      }
    });
    
    // If we couldn't extract any questions, provide at least one sample
    if (questions.length === 0 && assistantMessages.length > 0) {
      questions.push({
        id: "q1",
        type: "multiple-choice",
        question: `Question about ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0
      });
    }
    
    return questions;
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

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    toast({
      title: "API Key Saved",
      description: "Your OpenRouter API key has been saved",
    });
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>AI Quiz Creator</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto mb-4">
        {!apiKey ? (
          <div className="space-y-4">
            <div className="text-center p-6">
              <Bot className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Chat with Qwen AI</h3>
              <p className="text-muted-foreground mb-4">
                To use the AI chat feature, you need an OpenRouter API key
              </p>
            </div>
            <ApiKeyInput onApiKeySet={handleApiKeySet} />
          </div>
        ) : !chatStarted ? (
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
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => setApiKey("")}
              >
                Reset API Key
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
