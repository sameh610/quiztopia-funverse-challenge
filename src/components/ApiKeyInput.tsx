
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  language?: string;
}

const ApiKeyInput = ({ onApiKeySet, language = "en" }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast({
        title: getLocalizedText("apiKeyRequired", language),
        description: getLocalizedText("pleaseEnterApiKey", language),
        variant: "destructive",
      });
      return;
    }

    onApiKeySet(apiKey);
    toast({
      title: getLocalizedText("apiKeySet", language),
      description: getLocalizedText("apiKeySavedSession", language),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-center space-x-2">
        <Input
          type={isVisible ? "text" : "password"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={getLocalizedText("enterApiKeyPlaceholder", language)}
          className="flex-grow"
        />
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={() => setIsVisible(!isVisible)}
        >
          <Key className="h-4 w-4" />
        </Button>
        <Button type="submit" size="sm">
          <Check className="h-4 w-4 mr-2" />
          {getLocalizedText("set", language)}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {getLocalizedText("apiKeyStoredLocally", language)}
      </p>
    </form>
  );
};

// Helper function to get localized text
const getLocalizedText = (key: string, language: string): string => {
  const translations: Record<string, Record<string, string>> = {
    apiKeyRequired: {
      en: "API Key Required",
      es: "Se Requiere Clave API",
      fr: "Clé API Requise",
      de: "API-Schlüssel erforderlich"
    },
    pleaseEnterApiKey: {
      en: "Please enter your OpenRouter API key",
      es: "Por favor, ingresa tu clave API de OpenRouter",
      fr: "Veuillez saisir votre clé API OpenRouter",
      de: "Bitte geben Sie Ihren OpenRouter-API-Schlüssel ein"
    },
    apiKeySet: {
      en: "API Key Set",
      es: "Clave API Establecida",
      fr: "Clé API Définie",
      de: "API-Schlüssel Festgelegt"
    },
    apiKeySavedSession: {
      en: "Your API key has been saved for this session",
      es: "Tu clave API ha sido guardada para esta sesión",
      fr: "Votre clé API a été enregistrée pour cette session",
      de: "Ihr API-Schlüssel wurde für diese Sitzung gespeichert"
    },
    enterApiKeyPlaceholder: {
      en: "Enter your OpenRouter API key",
      es: "Ingresa tu clave API de OpenRouter",
      fr: "Saisissez votre clé API OpenRouter",
      de: "Geben Sie Ihren OpenRouter-API-Schlüssel ein"
    },
    set: {
      en: "Set",
      es: "Establecer",
      fr: "Définir",
      de: "Festlegen"
    },
    apiKeyStoredLocally: {
      en: "Your API key is stored locally in this browser session only.",
      es: "Tu clave API se almacena localmente solo en esta sesión del navegador.",
      fr: "Votre clé API est stockée localement dans cette session de navigateur uniquement.",
      de: "Ihr API-Schlüssel wird nur lokal in dieser Browser-Sitzung gespeichert."
    }
  };

  return translations[key]?.[language] || translations[key]?.["en"] || key;
};

export default ApiKeyInput;
