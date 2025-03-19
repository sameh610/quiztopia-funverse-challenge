
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeyInput = ({ onApiKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenRouter API key",
        variant: "destructive",
      });
      return;
    }

    onApiKeySet(apiKey);
    toast({
      title: "API Key Set",
      description: "Your API key has been saved for this session",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-center space-x-2">
        <Input
          type={isVisible ? "text" : "password"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your OpenRouter API key"
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
          Set
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Your API key is stored locally in this browser session only.
      </p>
    </form>
  );
};

export default ApiKeyInput;
