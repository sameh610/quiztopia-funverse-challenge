
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "High School Teacher",
    avatar: "SJ",
    content: "QuizTopia has completely transformed how I engage students in my classroom. The variety of game modes keeps the material fresh and exciting!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chang",
    role: "Middle School Student",
    avatar: "MC",
    content: "Learning used to be boring until my teacher introduced us to QuizTopia. Now I actually look forward to quiz days!",
    rating: 5,
  },
  {
    id: 3,
    name: "David Rodriguez",
    role: "Parent",
    avatar: "DR",
    content: "My kids are obsessed with QuizTopia. It's the first educational platform they actually want to use in their free time.",
    rating: 4,
  },
  {
    id: 4,
    name: "Emma Wilson",
    role: "University Professor",
    avatar: "EW",
    content: "The versatility of QuizTopia allows me to create engaging review sessions that my students genuinely enjoy participating in.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((current) => (current === testimonials.length - 1 ? 0 : current + 1));
  };

  const previous = () => {
    setCurrent((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  };

  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">
            What Our <span className="text-gradient">Users Say</span>
          </h2>
          <p className="mt-2 text-muted-foreground">
            Join thousands of satisfied students, teachers, and players
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 p-8 sm:p-10">
                  <div className="flex flex-col items-center text-center">
                    <Quote className="mb-6 h-10 w-10 text-quiztopia-primary opacity-20" />
                    
                    <p className="mb-6 text-lg italic">"{testimonial.content}"</p>
                    
                    <div className="mb-4 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating
                              ? "fill-quiztopia-warning text-quiztopia-warning"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    
                    <Avatar className="mb-3 h-16 w-16 bg-gradient-to-br from-quiztopia-primary to-quiztopia-accent">
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={previous}
              className="h-10 w-10 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous testimonial</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === current
                      ? "w-6 bg-quiztopia-primary"
                      : "bg-quiztopia-primary/30"
                  }`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="h-10 w-10 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
