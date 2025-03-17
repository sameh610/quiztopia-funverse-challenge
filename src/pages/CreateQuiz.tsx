
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  PlusCircle, 
  Trash2, 
  Save, 
  Upload, 
  FileUp, 
  Sparkles, 
  Edit, 
  CheckCircle,
  AlertCircle,
  Image as ImageIcon 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "true-false" | "fill-blank" | "image";
  question: string;
  options: string[];
  correctAnswer: number | boolean | string;
  image?: string;
}

const CreateQuiz = () => {
  const { toast } = useToast();
  
  // Quiz metadata
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  
  // Questions management
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: "q1",
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    }
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Add a new question
  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q${questions.length + 1}`,
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    };
    
    setQuestions([...questions, newQuestion]);
    setCurrentQuestionIndex(questions.length); // Switch to the new question
    
    toast({
      title: "Question added",
      description: `Added question #${questions.length + 1}`,
    });
  };
  
  // Delete a question
  const deleteQuestion = (index: number) => {
    if (questions.length === 1) {
      toast({
        title: "Cannot delete",
        description: "A quiz must have at least one question",
        variant: "destructive"
      });
      return;
    }
    
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
    
    // Adjust current index if needed
    if (currentQuestionIndex >= newQuestions.length) {
      setCurrentQuestionIndex(newQuestions.length - 1);
    }
    
    toast({
      title: "Question deleted",
      description: `Removed question #${index + 1}`
    });
  };
  
  // Update question content
  const updateQuestion = (field: keyof QuizQuestion, value: any) => {
    const newQuestions = [...questions];
    const currentQuestion = {...newQuestions[currentQuestionIndex]};
    
    if (field === 'type') {
      // Reset options and correct answer based on the new question type
      if (value === 'multiple-choice') {
        currentQuestion.options = ["", "", "", ""];
        currentQuestion.correctAnswer = 0;
      } else if (value === 'true-false') {
        currentQuestion.options = ["True", "False"];
        currentQuestion.correctAnswer = true;
      } else if (value === 'fill-blank') {
        currentQuestion.options = [];
        currentQuestion.correctAnswer = "";
      } else if (value === 'image') {
        currentQuestion.options = ["", "", "", ""];
        currentQuestion.correctAnswer = 0;
        currentQuestion.image = "";
      }
    }
    
    // @ts-ignore - We know the field exists on the object
    currentQuestion[field] = value;
    
    newQuestions[currentQuestionIndex] = currentQuestion;
    setQuestions(newQuestions);
  };
  
  // Update an option for a multiple-choice question
  const updateOption = (optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    const currentQuestion = {...newQuestions[currentQuestionIndex]};
    
    currentQuestion.options[optionIndex] = value;
    
    newQuestions[currentQuestionIndex] = currentQuestion;
    setQuestions(newQuestions);
  };
  
  // Handle saving the quiz
  const saveQuiz = () => {
    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please add a title for your quiz",
        variant: "destructive"
      });
      return;
    }
    
    // Check if all questions have content
    const incompleteQuestions = questions.filter(q => !q.question.trim());
    if (incompleteQuestions.length > 0) {
      toast({
        title: "Incomplete questions",
        description: `${incompleteQuestions.length} questions are missing content`,
        variant: "destructive"
      });
      return;
    }
    
    // Save quiz logic would go here
    console.log('Saving quiz:', {
      title,
      description,
      category,
      isPublic,
      questions
    });
    
    toast({
      title: "Quiz saved!",
      description: `"${title}" has been saved successfully.`,
      variant: "default"
    });
  };
  
  // Generate questions with AI (mock functionality)
  const generateWithAI = () => {
    toast({
      title: "AI generation initiated",
      description: "Generating questions based on your topic...",
    });
    
    // This would be replaced with actual AI generation call
    setTimeout(() => {
      const newQuestions = [
        {
          id: "q1",
          type: "multiple-choice" as const,
          question: "What is the capital of France?",
          options: ["Paris", "London", "Berlin", "Madrid"],
          correctAnswer: 0
        },
        {
          id: "q2",
          type: "true-false" as const,
          question: "The Pacific Ocean is the largest ocean on Earth.",
          options: ["True", "False"],
          correctAnswer: true
        },
        {
          id: "q3",
          type: "multiple-choice" as const,
          question: "Which planet is known as the Red Planet?",
          options: ["Mars", "Venus", "Jupiter", "Mercury"],
          correctAnswer: 0
        }
      ];
      
      setQuestions(newQuestions);
      setCurrentQuestionIndex(0);
      
      toast({
        title: "Questions generated!",
        description: `Successfully generated ${newQuestions.length} questions.`,
      });
    }, 2000);
  };
  
  // Import questions from file (mock functionality)
  const importQuestions = () => {
    toast({
      title: "Coming Soon",
      description: "File import functionality will be available in a future update.",
    });
  };
  
  // Current question being edited
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Create a <span className="text-gradient">New Quiz</span>
          </h1>
          <p className="text-muted-foreground">
            Design your own quiz with custom questions and answers
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main quiz editor */}
          <div className="space-y-8">
            {/* Quiz metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz Details</CardTitle>
                <CardDescription>Basic information about your quiz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter quiz title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this quiz is about"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="literature">Literature</SelectItem>
                        <SelectItem value="geography">Geography</SelectItem>
                        <SelectItem value="general">General Knowledge</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      id="public"
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                    <Label htmlFor="public">Make quiz public</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Question editor */}
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
                  <CardDescription>
                    {questions.length} question{questions.length !== 1 ? "s" : ""} total
                  </CardDescription>
                </div>
                
                <div className="flex space-x-2">
                  <Select 
                    value={currentQuestion.type} 
                    onValueChange={(value: any) => updateQuestion("type", value)}
                  >
                    <SelectTrigger className="w-auto">
                      <SelectValue placeholder="Question Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                      <SelectItem value="image">Image Based</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteQuestion(currentQuestionIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter your question here"
                    value={currentQuestion.question}
                    onChange={(e) => updateQuestion("question", e.target.value)}
                  />
                </div>
                
                {currentQuestion.type === "image" && (
                  <div className="rounded-lg border border-dashed p-4">
                    <div className="flex flex-col items-center justify-center text-center">
                      <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        Drag and drop an image, or click to select
                      </p>
                      <Button variant="outline" size="sm">
                        Select Image
                      </Button>
                    </div>
                  </div>
                )}
                
                {(currentQuestion.type === "multiple-choice" || currentQuestion.type === "image") && (
                  <div className="space-y-4">
                    <Label>Options</Label>
                    <RadioGroup 
                      value={currentQuestion.correctAnswer.toString()}
                      onValueChange={(value) => updateQuestion("correctAnswer", parseInt(value))}
                    >
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            className="flex-grow"
                          />
                        </div>
                      ))}
                    </RadioGroup>
                    <p className="text-sm text-muted-foreground">
                      Select the radio button next to the correct answer
                    </p>
                  </div>
                )}
                
                {currentQuestion.type === "true-false" && (
                  <div className="space-y-4">
                    <Label>Correct Answer</Label>
                    <RadioGroup 
                      value={currentQuestion.correctAnswer ? "true" : "false"}
                      onValueChange={(value) => updateQuestion("correctAnswer", value === "true")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="answer-true" />
                        <Label htmlFor="answer-true">True</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="answer-false" />
                        <Label htmlFor="answer-false">False</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
                
                {currentQuestion.type === "fill-blank" && (
                  <div className="space-y-2">
                    <Label htmlFor="correct-answer">Correct Answer</Label>
                    <Input
                      id="correct-answer"
                      placeholder="Enter the correct answer"
                      value={currentQuestion.correctAnswer as string}
                      onChange={(e) => updateQuestion("correctAnswer", e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="justify-between">
                <div className="flex space-x-1">
                  {questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={index === currentQuestionIndex ? "default" : "outline"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={addQuestion}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const nextIndex = (currentQuestionIndex + 1) % questions.length;
                    setCurrentQuestionIndex(nextIndex);
                  }}
                >
                  Next Question
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={saveQuiz}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Quiz
                </Button>
                
                <Button variant="outline" className="w-full" onClick={importQuestions}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Questions
                </Button>
                
                <Button variant="secondary" className="w-full" onClick={generateWithAI}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate with AI
                </Button>
              </CardContent>
            </Card>
            
            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tips & Tricks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                    <span>Keep questions clear and concise for better engagement</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                    <span>Mix different question types to maintain interest</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                    <span>Include images to make questions more engaging</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 text-orange-500" />
                    <span>Avoid overly complex or confusing wording</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateQuiz;
