
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
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem("quiz_language") || "en";
  });
  const [lastExtractedQuestions, setLastExtractedQuestions] = useState<any[]>([]);
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

  useEffect(() => {
    // Save language preference to localStorage
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
    
    if (!apiKey) {
      toast({
        title: getLocalizedText("apiKeyRequired", language),
        description: getLocalizedText("enterApiKey", language),
        variant: "destructive",
      });
      return;
    }
    
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!apiKey) {
      toast({
        title: getLocalizedText("apiKeyRequired", language),
        description: getLocalizedText("enterApiKey", language),
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
      
      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);
      
      // Extract questions after each AI response and store them
      const extractedQuestions = parseQuestionsFromMessages(updatedMessages);
      if (extractedQuestions.length > 0) {
        setLastExtractedQuestions(extractedQuestions);
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
    
    // Use the latest extracted questions
    if (lastExtractedQuestions.length > 0) {
      toast({
        title: getLocalizedText("quizGenerated", language),
        description: getLocalizedText("createdQuestions", language)
          .replace("{count}", lastExtractedQuestions.length.toString()),
      });
      
      onGenerateQuestions(lastExtractedQuestions);
    } else {
      // If no questions were automatically extracted, try one more time
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
    setLastExtractedQuestions([]);
  };

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    toast({
      title: getLocalizedText("apiKeySaved", language),
      description: getLocalizedText("apiKeySavedDesc", language),
    });
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{getLocalizedText("aiQuizCreator", language)}</CardTitle>
        <div className="flex justify-end">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 py-1 text-sm rounded border border-input bg-background"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto mb-4">
        {!apiKey ? (
          <div className="space-y-4">
            <div className="text-center p-6">
              <Bot className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{getLocalizedText("chatWithAI", language)}</h3>
              <p className="text-muted-foreground mb-4">
                {getLocalizedText("apiKeyNeeded", language)}
              </p>
            </div>
            <ApiKeyInput onApiKeySet={handleApiKeySet} language={language} />
          </div>
        ) : !chatStarted ? (
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
              <Button onClick={handleStartChat} className="w-full">
                {getLocalizedText("startChat", language)}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => setApiKey("")}
              >
                {getLocalizedText("resetApiKey", language)}
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
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleReset}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {getLocalizedText("reset", language)}
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={handleGenerateQuiz}
              >
                <Plus className="mr-2 h-4 w-4" />
                {getLocalizedText("createQuiz", language)}
              </Button>
            </div>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
};

// Helper function to get localized text
const getLocalizedText = (key: string, language: string): string => {
  const translations: Record<string, Record<string, string>> = {
    aiQuizCreator: {
      en: "AI Quiz Creator",
      es: "Creador de Cuestionarios IA",
      fr: "Créateur de Quiz IA",
      de: "KI-Quiz-Ersteller"
    },
    chatWithAI: {
      en: "Chat with Qwen AI",
      es: "Chatear con Qwen IA",
      fr: "Discuter avec Qwen IA",
      de: "Mit Qwen KI chatten"
    },
    apiKeyNeeded: {
      en: "To use the AI chat feature, you need an OpenRouter API key",
      es: "Para usar la función de chat con IA, necesitas una clave API de OpenRouter",
      fr: "Pour utiliser la fonction de chat IA, vous avez besoin d'une clé API OpenRouter",
      de: "Um die KI-Chat-Funktion zu nutzen, benötigen Sie einen OpenRouter-API-Schlüssel"
    },
    startByEnteringTopic: {
      en: "Start by entering a topic, then chat with the AI to create customized quiz questions.",
      es: "Comienza ingresando un tema, luego chatea con la IA para crear preguntas personalizadas.",
      fr: "Commencez par saisir un sujet, puis discutez avec l'IA pour créer des questions de quiz personnalisées.",
      de: "Beginnen Sie mit der Eingabe eines Themas und chatten Sie dann mit der KI, um personalisierte Quizfragen zu erstellen."
    },
    enterTopicPlaceholder: {
      en: "Enter topic (e.g. World Geography, History, Science)",
      es: "Introduce un tema (ej. Geografía Mundial, Historia, Ciencia)",
      fr: "Entrez un sujet (ex. Géographie mondiale, Histoire, Science)",
      de: "Thema eingeben (z.B. Weltgeografie, Geschichte, Wissenschaft)"
    },
    startChat: {
      en: "Start Chat",
      es: "Iniciar Chat",
      fr: "Démarrer la Discussion",
      de: "Chat starten"
    },
    resetApiKey: {
      en: "Reset API Key",
      es: "Reiniciar Clave API",
      fr: "Réinitialiser la Clé API",
      de: "API-Schlüssel zurücksetzen"
    },
    typeYourMessage: {
      en: "Type your message...",
      es: "Escribe tu mensaje...",
      fr: "Tapez votre message...",
      de: "Geben Sie Ihre Nachricht ein..."
    },
    reset: {
      en: "Reset",
      es: "Reiniciar",
      fr: "Réinitialiser",
      de: "Zurücksetzen"
    },
    createQuiz: {
      en: "Create Quiz",
      es: "Crear Cuestionario",
      fr: "Créer Quiz",
      de: "Quiz erstellen"
    },
    pleaseEnterTopic: {
      en: "Please enter a topic",
      es: "Por favor ingresa un tema",
      fr: "Veuillez entrer un sujet",
      de: "Bitte geben Sie ein Thema ein"
    },
    topicNeeded: {
      en: "A topic is needed to start the AI chat",
      es: "Se necesita un tema para iniciar el chat con IA",
      fr: "Un sujet est nécessaire pour démarrer le chat IA",
      de: "Ein Thema wird benötigt, um den KI-Chat zu starten"
    },
    apiKeyRequired: {
      en: "API Key Required",
      es: "Se Requiere Clave API",
      fr: "Clé API Requise",
      de: "API-Schlüssel erforderlich"
    },
    enterApiKey: {
      en: "Please enter your OpenRouter API key first",
      es: "Por favor, introduce primero tu clave API de OpenRouter",
      fr: "Veuillez d'abord saisir votre clé API OpenRouter",
      de: "Bitte geben Sie zuerst Ihren OpenRouter-API-Schlüssel ein"
    },
    welcomeMessage: {
      en: "I'll help you create quiz questions about \"{topic}\". What kind of questions would you like to create? You can ask for multiple-choice, true/false, fill-in-the-blank, or other question types.",
      es: "Te ayudaré a crear preguntas de cuestionario sobre \"{topic}\". ¿Qué tipo de preguntas te gustaría crear? Puedes pedir preguntas de opción múltiple, verdadero/falso, completar espacios en blanco u otros tipos.",
      fr: "Je vais vous aider à créer des questions de quiz sur \"{topic}\". Quel type de questions souhaitez-vous créer ? Vous pouvez demander des QCM, vrai/faux, texte à trous, ou d'autres types de questions.",
      de: "Ich helfe Ihnen, Quizfragen zu \"{topic}\" zu erstellen. Welche Art von Fragen möchten Sie erstellen? Sie können Multiple-Choice, Wahr/Falsch, Lückentexte oder andere Fragetypen anfordern."
    },
    error: {
      en: "Error",
      es: "Error",
      fr: "Erreur",
      de: "Fehler"
    },
    communicationError: {
      en: "Failed to communicate with the AI. Please check your API key and try again.",
      es: "No se pudo comunicar con la IA. Por favor, verifica tu clave API e intenta de nuevo.",
      fr: "Échec de la communication avec l'IA. Veuillez vérifier votre clé API et réessayer.",
      de: "Kommunikation mit der KI fehlgeschlagen. Bitte überprüfen Sie Ihren API-Schlüssel und versuchen Sie es erneut."
    },
    moreConversationNeeded: {
      en: "More conversation needed",
      es: "Se necesita más conversación",
      fr: "Plus de conversation nécessaire",
      de: "Mehr Konversation benötigt"
    },
    chatMore: {
      en: "Please chat with the AI a bit more to generate better quiz questions",
      es: "Por favor, chatea un poco más con la IA para generar mejores preguntas",
      fr: "Veuillez discuter un peu plus avec l'IA pour générer de meilleures questions",
      de: "Bitte chatten Sie etwas mehr mit der KI, um bessere Quizfragen zu generieren"
    },
    quizGenerated: {
      en: "Quiz Generated",
      es: "Cuestionario Generado",
      fr: "Quiz Généré",
      de: "Quiz Erstellt"
    },
    createdQuestions: {
      en: "Created {count} questions based on your conversation",
      es: "Se crearon {count} preguntas basadas en tu conversación",
      fr: "Création de {count} questions basées sur votre conversation",
      de: "{count} Fragen wurden basierend auf Ihrem Gespräch erstellt"
    },
    noQuestionsFound: {
      en: "No questions found",
      es: "No se encontraron preguntas",
      fr: "Aucune question trouvée",
      de: "Keine Fragen gefunden"
    },
    couldntExtract: {
      en: "Couldn't extract questions from the conversation. Try asking the AI to create some specific questions.",
      es: "No se pudieron extraer preguntas de la conversación. Intenta pedirle a la IA que cree algunas preguntas específicas.",
      fr: "Impossible d'extraire des questions de la conversation. Essayez de demander à l'IA de créer des questions spécifiques.",
      de: "Aus dem Gespräch konnten keine Fragen extrahiert werden. Bitten Sie die KI, einige spezifische Fragen zu erstellen."
    },
    apiKeySaved: {
      en: "API Key Saved",
      es: "Clave API Guardada",
      fr: "Clé API Enregistrée",
      de: "API-Schlüssel Gespeichert"
    },
    apiKeySavedDesc: {
      en: "Your OpenRouter API key has been saved",
      es: "Tu clave API de OpenRouter ha sido guardada",
      fr: "Votre clé API OpenRouter a été enregistrée",
      de: "Ihr OpenRouter-API-Schlüssel wurde gespeichert"
    }
  };

  return translations[key]?.[language] || translations[key]?.["en"] || key;
};

export default AIChatInterface;
