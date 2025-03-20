import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, Plus, RefreshCw, AlertTriangle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ApiKeyInput from "@/components/ApiKeyInput";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatInterfaceProps {
  onGenerateQuestions: (questions: any[]) => void;
}

interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "true-false" | "fill-blank" | "image";
  question: string;
  options: string[];
  correctAnswer: number | boolean | string;
  image?: string;
}

// Fixed API key - do not expose to users in production
const FIXED_API_KEY = "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";

const AIChatInterface = ({ onGenerateQuestions }: AIChatInterfaceProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem("quiz_language") || "en";
  });
  const [lastExtractedQuestions, setLastExtractedQuestions] = useState<QuizQuestion[]>([]);
  const [model, setModel] = useState<string>("mistralai/mistral-small-3.1-24b-instruct:free");
  const [apiError, setApiError] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("quiz_language", language);
  }, [language]);

  const handleStartChat = () => {
    if (!topic.trim()) {
      toast({
        title: getLocalizedText("pleaseEnterTopic", language),
        description: getLocalizedText("topicNeeded", language),
        variant: "destructive",
      });
      return;
    }
    
    setApiError("");
    setChatStarted(true);
    
    const welcomeMessage = getLocalizedText("welcomeMessage", language)
      .replace("{topic}", topic);
    
    setMessages([
      {
        role: "assistant",
        content: welcomeMessage
      }
    ]);
  };

  const handlePremiumModelSelect = (selectedModel: string) => {
    if (!isPremium) {
      setShowPremiumModal(true);
      toast({
        title: getLocalizedText("premiumRequired", language),
        description: getLocalizedText("premiumRequiredDesc", language),
        variant: "destructive",
      });
      return;
    }
    
    setModel(selectedModel);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setApiError("");
    const userMessage: Message = { role: "user", content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMessage];
      
      console.log("Sending request to OpenRouter with model:", model);
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${FIXED_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Quiz Creator"
        },
        body: JSON.stringify({
          model: model,
          messages: chatHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("API Error:", data);
        const errorMessage = data?.error?.message || `Error ${response.status}`;
        setApiError(errorMessage);
        throw new Error(`Failed to get response from AI: ${response.status} ${errorMessage}`);
      }

      const assistantMessage: Message = { 
        role: "assistant", 
        content: data.choices[0].message.content 
      };
      
      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);
      
      const extractedQuestions = parseQuestionsFromMessages(updatedMessages);
      if (extractedQuestions.length > 0) {
        setLastExtractedQuestions(extractedQuestions);
        console.log("Extracted questions:", extractedQuestions);
      }
    } catch (error) {
      console.error("Error communicating with AI:", error);
      toast({
        title: getLocalizedText("error", language),
        description: getLocalizedText("communicationError", language),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = () => {
    if (messages.length < 2) {
      toast({
        title: getLocalizedText("moreConversationNeeded", language),
        description: getLocalizedText("chatMore", language),
        variant: "destructive",
      });
      return;
    }
    
    if (lastExtractedQuestions.length > 0) {
      toast({
        title: getLocalizedText("quizGenerated", language),
        description: getLocalizedText("createdQuestions", language)
          .replace("{count}", lastExtractedQuestions.length.toString()),
      });
      
      onGenerateQuestions(lastExtractedQuestions);
    } else {
      const extractedQuestions = parseQuestionsFromMessages(messages);
      
      if (extractedQuestions.length > 0) {
        setLastExtractedQuestions(extractedQuestions);
        toast({
          title: getLocalizedText("quizGenerated", language),
          description: getLocalizedText("createdQuestions", language)
            .replace("{count}", extractedQuestions.length.toString()),
        });
        
        onGenerateQuestions(extractedQuestions);
      } else {
        toast({
          title: getLocalizedText("noQuestionsFound", language),
          description: getLocalizedText("couldntExtract", language),
          variant: "destructive",
        });
      }
    }
  };

  const handleUpgradeToPremium = () => {
    toast({
      title: getLocalizedText("upgradingToPremium", language),
      description: getLocalizedText("processingPayment", language),
    });
    
    // Simulate payment processing
    setTimeout(() => {
      setIsPremium(true);
      setShowPremiumModal(false);
      toast({
        title: getLocalizedText("premiumActivated", language),
        description: getLocalizedText("enjoyPremiumFeatures", language),
      });
    }, 2000);
  };

  const parseQuestionsFromMessages = (messages: Message[]): QuizQuestion[] => {
    const assistantMessages = messages.filter(m => m.role === "assistant");
    let questions: QuizQuestion[] = [];
    
    assistantMessages.forEach((message) => {
      const content = message.content;
      
      const numberedQuestions = content.match(/(?:^|\n)(?:\d+\.|\d+\)|\(\d+\)|[١٢٣٤٥٦٧٨٩٠]+\.|\w+\.|\w+\)|\(\w+\))[^\n]+(?:\n[^\n\d١٢٣٤٥٦٧٨٩٠]+)+/gm);
      
      if (numberedQuestions && numberedQuestions.length > 0) {
        numberedQuestions.forEach((questionBlock, index) => {
          const lines = questionBlock.trim().split('\n');
          const questionText = lines[0].replace(/^(?:\d+\.|\d+\)|\(\d+\)|[١٢٣٤٥٦٧٨٩٠]+\.|\w+\.|\w+\)|\(\w+\))\s*/m, '').trim();
          
          const optionLines = lines.slice(1);
          const options: string[] = [];
          
          const optionMarkers = optionLines.filter(line => 
            /^(?:[A-Da-d]\.|\([A-Da-d]\)|[A-Da-d]\)|\w\.|\(\w\)|\w\))/.test(line.trim())
          );
          
          if (optionMarkers.length >= 2) {
            optionLines.forEach(line => {
              const optionMatch = line.match(/^(?:[A-Da-d]\.|\([A-Da-d]\)|[A-Da-d]\)|\w\.|\(\w\)|\w\))\s*(.+)/);
              if (optionMatch) {
                options.push(optionMatch[1].trim());
              }
            });
            
            if (options.length >= 2) {
              questions.push({
                id: `q${questions.length + 1}`,
                type: "multiple-choice",
                question: questionText,
                options: options.length >= 4 ? options.slice(0, 4) : [...options, ...Array(4 - options.length).fill("")],
                correctAnswer: 0
              });
            } else {
              questions.push({
                id: `q${questions.length + 1}`,
                type: "multiple-choice",
                question: questionText,
                options: ["Option A", "Option B", "Option C", "Option D"],
                correctAnswer: 0
              });
            }
          } else if (/true|false|صح|خطأ|נכון|לא נכון|adevărat|fals/i.test(questionBlock)) {
            questions.push({
              id: `q${questions.length + 1}`,
              type: "true-false",
              question: questionText,
              options: ["True", "False"],
              correctAnswer: true
            });
          } else {
            questions.push({
              id: `q${questions.length + 1}`,
              type: "fill-blank",
              question: questionText,
              options: [],
              correctAnswer: ""
            });
          }
        });
      }
      
      if (questions.length === 0) {
        const questionMarkSplit = content.split(/\?[.\s]/);
        questionMarkSplit.forEach((potentialQuestion, index) => {
          if (potentialQuestion.trim().length > 10 && !potentialQuestion.includes('?')) {
            questions.push({
              id: `q${questions.length + 1}`,
              type: "multiple-choice",
              question: `${potentialQuestion.trim()}?`,
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswer: 0
            });
          }
        });
      }
    });
    
    questions = questions.map((q, index) => ({
      ...q,
      id: `q${index + 1}`
    }));
    
    console.log(`Extracted ${questions.length} questions`);
    
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
    setLastExtractedQuestions([]);
    setApiError("");
  };

  const verifyModelAvailability = async () => {
    setIsLoading(true);
    setApiError("");
    
    try {
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${FIXED_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Quiz Creator - Model Verification"
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setApiError(data?.error?.message || getLocalizedText("modelCheckFailed", language));
        toast({
          title: getLocalizedText("modelCheckFailed", language),
          description: getLocalizedText("tryAgainLater", language),
          variant: "destructive",
        });
      } else {
        toast({
          title: getLocalizedText("modelsAvailable", language),
          description: getLocalizedText("readyToUse", language),
        });
      }
    } catch (error) {
      console.error("Model verification error:", error);
      setApiError(getLocalizedText("verificationFailed", language));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{getLocalizedText("aiQuizCreator", language)}</CardTitle>
        <div className="flex justify-between items-center gap-2 mt-2">
          <select
            value={model}
            onChange={(e) => {
              const selectedModel = e.target.value;
              if (selectedModel === "mistralai/mistral-small-3.1-24b-instruct:free") {
                setModel(selectedModel);
              } else {
                handlePremiumModelSelect(selectedModel);
              }
            }}
            className="px-2 py-1 text-sm rounded border border-input bg-background max-w-[300px]"
          >
            <option value="mistralai/mistral-small-3.1-24b-instruct:free">Mistral Small 24B (Default)</option>
            <option value="openai/gpt-4o:free">{isPremium ? "GPT-4o" : "🔒 GPT-4o (Premium)"}</option>
            <option value="anthropic/claude-3-opus:ultra">{isPremium ? "Claude 3 Opus" : "🔒 Claude 3 Opus (Premium)"}</option>
            <option value="meta/llama-3-70b-instruct:free">{isPremium ? "Llama 3 70B" : "🔒 Llama 3 70B (Premium)"}</option>
            <option value="mistralai/mistral-large-latest">{isPremium ? "Mistral Large" : "🔒 Mistral Large (Premium)"}</option>
            <option value="google/gemini-1.5-pro:latest">{isPremium ? "Gemini 1.5 Pro" : "🔒 Gemini 1.5 Pro (Premium)"}</option>
          </select>
          
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 py-1 text-sm rounded border border-input bg-background"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="ar">العربية</option>
            <option value="ro">Română</option>
            <option value="he">עברית</option>
          </select>
        </div>
        
        {!isPremium && (
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600 border-0"
              onClick={() => setShowPremiumModal(true)}
            >
              <Lock className="h-4 w-4" />
              {getLocalizedText("upgradeForPremiumModels", language)}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow overflow-auto mb-4">
        {apiError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{getLocalizedText("apiError", language)}</AlertTitle>
            <AlertDescription>
              {apiError}
            </AlertDescription>
          </Alert>
        )}
        
        {showPremiumModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">{getLocalizedText("premiumUpgrade", language)}</h3>
              <p className="mb-6">{getLocalizedText("premiumUpgradeDesc", language)}</p>
              <div className="border rounded-lg p-4 mb-6">
                <div className="font-medium text-lg mb-2">{getLocalizedText("premiumPlan", language)}</div>
                <div className="text-2xl font-bold mb-2">$20/month</div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    {getLocalizedText("accessAllModels", language)}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    {getLocalizedText("unlimitedQuizzes", language)}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    {getLocalizedText("prioritySupport", language)}
                  </li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={handleUpgradeToPremium}
                >
                  {getLocalizedText("subscribe", language)}
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPremiumModal(false)}
                >
                  {getLocalizedText("cancel", language)}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {!chatStarted ? (
          <div className="space-y-4">
            <div className="text-center p-6">
              <Bot className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{getLocalizedText("chatWithAI", language)}</h3>
              <p className="text-muted-foreground mb-4">
                {getLocalizedText("startByEnteringTopic", language)}
              </p>
            </div>
            <div className="space-y-2">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={getLocalizedText("enterTopicPlaceholder", language)}
                onKeyDown={handleKeyDown}
              />
              <div className="flex gap-2 w-full">
                <Button onClick={handleStartChat} className="flex-1">
                  {getLocalizedText("startChat", language)}
                </Button>
                <Button onClick={verifyModelAvailability} variant="outline" disabled={isLoading}>
                  {getLocalizedText("checkAvailability", language)}
                </Button>
              </div>
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
                placeholder={getLocalizedText("typeYourMessage", language)}
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
            <div className="flex justify-between space-x-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {getLocalizedText("reset", language)}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleGenerateQuiz}
                className="flex-1"
              >
                <Plus className="mr-2 h-4 w-4" />
                {getLocalizedText("createQuiz", language)}
              </Button>
            </div>
            {lastExtractedQuestions.length > 0 && (
              <div className="text-sm text-muted-foreground text-center pt-2">
                {getLocalizedText("questionsReady", language).replace("{count}", lastExtractedQuestions.length.toString())}
              </div>
            )}
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
};

const getLocalizedText = (key: string, language: string): string => {
  const translations: Record<string, Record<string, string>> = {
    aiQuizCreator: {
      en: "AI Quiz Creator",
      es: "Creador de Cuestionarios IA",
      fr: "Créateur de Quiz IA",
      de: "KI-Quiz-Ersteller",
      ar: "منشئ الاختبارات بالذكاء الاصطناعي",
      ro: "Creator de Quiz AI",
      he: "יוצר חידונים בינה מלאכותית"
    },
    chatWithAI: {
      en: "Chat with Qwen AI",
      es: "Chatear con Qwen IA",
      fr: "Discuter avec Qwen IA",
      de: "Mit Qwen KI chatten",
      ar: "الدردشة مع Qwen AI",
      ro: "Discută cu Qwen AI",
      he: "שוחח עם בינה מלאכותית Qwen"
    },
    apiKeyNeeded: {
      en: "To use the AI chat feature, you need an OpenRouter API key",
      es: "Para usar la función de chat con IA, necesitas una clave API de OpenRouter",
      fr: "Pour utiliser la fonction de chat IA, vous avez besoin d'une clé API OpenRouter",
      de: "Um die KI-Chat-Funktion zu nutzen, benötigen Sie einen OpenRouter-API-Schlüssel",
      ar: "لاستخدام ميزة الدردشة مع الذكاء الاصطناعي، تحتاج إلى مفتاح OpenRouter API",
      ro: "Pentru a utiliza funcția de chat AI, aveți nevoie de o cheie API OpenRouter",
      he: "כדי להשתמש בתכונת הצ'אט עם בינה מלאכותית, אתה צריך מפתח API של OpenRouter"
    },
    startByEnteringTopic: {
      en: "Start by entering a topic, then chat with the AI to create customized quiz questions.",
      es: "Comienza ingresando un tema, luego chatea con la IA para crear preguntas personalizadas.",
      fr: "Commencez par saisir un sujet, puis discutez avec l'IA pour créer des questions de quiz personnalisées.",
      de: "Beginnen Sie mit der Eingabe eines Themas und chatten Sie dann mit der KI, um personalisierte Quizfragen zu erstellen.",
      ar: "ابدأ بإدخال موضوع، ثم تحدث مع الذكاء الاصطناعي لإنشاء أسئلة اختبار مخصصة.",
      ro: "Începeți prin introducerea unui subiect, apoi discutați cu AI pentru a crea întrebări personalizate de quiz.",
      he: "התחל על ידי הזן נושא, ואז שוחח עם הבינה המלאכותית ליצירת שאלות חידון מותאמות אישית."
    },
    enterTopicPlaceholder: {
      en: "Enter topic (e.g. World Geography, History, Science)",
      es: "Introduce un tema (ej. Geografía Mundial, Historia, Ciencia)",
      fr: "Entrez un sujet (ex. Géographie mondiale, Histoire, Science)",
      de: "Thema eingeben (z.B. Weltgeografie, Geschichte, Wissenschaft)",
      ar: "أدخل الموضوع (مثل الجغرافيا العالمية، التاريخ، العلوم)",
      ro: "Introduceți subiectul (ex. Geografie Mondială, Istorie, Știință)",
      he: "הזן נושא (למשל גיאוגרפיה עולמית, היסטוריה, מדע)"
    },
    startChat: {
      en: "Start Chat",
      es: "Iniciar Chat",
      fr: "Démarrer la Discussion",
      de: "Chat starten",
      ar: "بدء الدردشة",
      ro: "Începe Discuția",
      he: "התחל צ'אט"
    },
    resetApiKey: {
      en: "Reset API Key",
      es: "Reiniciar Clave API",
      fr: "Réinitialiser la Clé API",
      de: "API-Schlüssel zurücksetzen",
      ar: "إعادة تعيين مفتاح API",
      ro: "Resetează Cheia API",
      he: "אפס מפתח API"
    },
    typeYourMessage: {
      en: "Type your message...",
      es: "Escribe tu mensaje...",
      fr: "Tapez votre message...",
      de: "Geben Sie Ihre Nachricht ein...",
      ar: "اكتب رسالتك...",
      ro: "Scrieți mesajul dvs...",
      he: "הקלד את ההודעה שלך..."
    },
    reset: {
      en: "Reset",
      es: "Reiniciar",
      fr: "Réinitialiser",
      de: "Zurücksetzen",
      ar: "إعادة تعيين",
      ro: "Resetează",
      he: "אפס"
    },
    createQuiz: {
      en: "Create Quiz",
      es: "Crear Cuestionario",
      fr: "Créer Quiz",
      de: "Quiz erstellen",
      ar: "إنشاء اختبار",
      ro: "Creează Quiz",
      he: "צור חידון"
    },
    pleaseEnterTopic: {
      en: "Please enter a topic",
      es: "Por favor ingresa un tema",
      fr: "Veuillez entrer un sujet",
      de: "Bitte geben Sie ein Thema ein",
      ar: "الرجاء إدخال موضوع",
      ro: "Vă rugăm să introduceți un subiect",
      he: "אנא הזן נושא"
    },
    topicNeeded: {
      en: "A topic is needed to start the AI chat",
      es: "Se necesita un tema para iniciar el chat con IA",
      fr: "Un sujet est nécessaire pour démarrer le chat IA",
      de: "Ein Thema wird benötigt, um den KI-Chat zu starten",
      ar: "موضوع مطلوب لبدء الدردشة مع الذكاء الاصطناعي",
      ro: "Un subiect este necesar pentru a începe discuția cu AI",
      he: "נדרש נושא כדי להתחיל את הצ'אט עם הבינה המלאכותית"
    },
    apiKeyRequired: {
      en: "API Key Required",
      es: "Se Requiere Clave API",
      fr: "Clé API Requise",
      de: "API-Schlüssel erforderlich",
      ar: "مفتاح API مطلوب",
      ro: "Cheie API necesară",
      he: "נדרש מפתח API"
    },
    enterApiKey: {
      en: "Please enter your OpenRouter API key first",
      es: "Por favor, introduce primero tu clave API de OpenRouter",
      fr: "Veuillez d'abord saisir votre clé API OpenRouter",
      de: "Bitte geben Sie zuerst Ihren OpenRouter-API-Schlüssel ein",
      ar: "الرجاء إدخال مفتاح OpenRouter API الخاص بك أولاً",
      ro: "Vă rugăm să introduceți mai întâi cheia API OpenRouter",
      he: "אנא הזן תחילה את מפתח ה-API שלך ונסה שוב."
    },
    welcomeMessage: {
      en: "I'll help you create quiz questions about \"{topic}\". What kind of questions would you like to create? You can ask for multiple-choice, true/false, fill-in-the-blank, or other question types.",
      es: "Te ayudaré a crear preguntas de cuestionario sobre \"{topic}\". ¿Qué tipo de preguntas te gustaría crear? Puedes pedir preguntas de opción múltiple, verdadero/falso, completar espacios en blanco u otros tipos.",
      fr: "Je vais vous aider à créer des questions de quiz sur \"{topic}\". Quel type de questions souhaitez-vous créer ? Vous pouvez demander des QCM, vrai/faux, texte à trous, ou d'autres types de questions.",
      de: "Ich helfe Ihnen, Quizfragen zu \"{topic}\" zu erstellen. Welche Art von Fragen möchten Sie erstellen? Sie können Multiple-Choice, Wahr/Falsch, Lückentexte oder andere Fragetypen anfordern.",
      ar: "سأساعدك في إنشاء أسئلة اختبار حول \"{topic}\". ما نوع الأسئلة التي ترغب في إنشائها؟ يمكنك طلب أسئلة متعددة الخيارات، صح/خطأ، ملء الفراغات، أو أنواع أخرى.",
      ro: "Te voi ajuta să creezi întrebări de quiz despre \"{topic}\". Ce tip de întrebări ai dori să creezi? Poți cere întrebări cu variante multiple, adevărat/fals, completare de spații goale sau alte tipuri.",
      he: "אני אעזור לך ליצור שאלות חידון על \"{topic}\". איזה סוג של שאלות תרצה ליצור? אתה יכול לבקש שאלות רב-ברירה, נכון/לא נכון, השלמת מילים, או סוגי שאלות אחרים."
    },
    error: {
      en: "Error",
      es: "Error",
      fr: "Erreur",
      de: "Fehler",
      ar: "خطأ",
      ro: "Eroare",
      he: "שגיאה"
    },
    communicationError: {
      en: "Failed to communicate with the AI. Please check your API key and try again.",
      es: "No se pudo comunicar con la IA. Por favor, verifica tu clave API e intenta de nuevo.",
      fr: "Échec de la communication avec l'IA. Veuillez vérifier votre clé API et réessayer.",
      de: "Kommunikation mit der KI fehlgeschlagen. Bitte überprüfen Sie Ihren API-Schlüssel und versuchen Sie es erneut.",
      ar: "فشل في التواصل مع الذكاء الاصطناعي. يرجى التحقق من مفتاح API الخاص بك والمحاولة مرة أخرى.",
      ro: "Comunicarea cu AI a eșuat. Vă rugăm să verificați cheia API și să încercați din nou.",
      he: "נכשל בתקשורת עם הבינה המלאכותית. אנא בדוק את מפתח ה-API שלך ונסה שוב."
    },
    moreConversationNeeded: {
      en: "More conversation needed",
      es: "Se necesita más conversación",
      fr: "Plus de conversation nécessaire",
      de: "Mehr Konversation benötigt",
      ar: "مطلوب المزيد من المحادثة",
      ro: "Este necesară mai multă conversație",
      he: "נדרשת שיחה נוספת"
    },
    chatMore: {
      en: "Please chat with the AI a bit more to generate better quiz questions",
      es: "Por favor, chatea un poco más con la IA para generar mejores preguntas",
      fr: "Veuillez discuter un poco plus avec l'IA pour générer de meilleures questions",
      de: "Bitte chatten Sie etwas mehr mit der KI, um bessere Quizfragen zu generieren",
      ar: "يرجى الدردشة مع الذكاء الاصطناعي قليلاً أكثر لإنشاء أسئلة اختبار أفضل",
      ro: "Vă rugăm să discutați mai mult cu AI pentru a genera întrebări de quiz mai bune",
      he: "אנא שוחח עם הבינה המלאכותית קצת יותר כדי ליצור שאלות חידון טובות יותר"
    },
    quizGenerated: {
      en: "Quiz Generated",
      es: "Cuestionario Generado",
      fr: "Quiz Généré",
      de: "Quiz Erstellt",
      ar: "تم إنشاء الاختبار",
      ro: "
