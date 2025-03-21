
import { useState } from "react";
import { SignIn } from "@clerk/clerk-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-12">
        <div className="mx-auto max-w-md">
          <h1 className="mb-6 text-center text-3xl font-bold">Welcome to QuizTopia</h1>
          <p className="mb-8 text-center text-muted-foreground">
            Sign in to access all features, track your progress, and compete on leaderboards.
          </p>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            {errorMessage && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800">
                <p>{errorMessage}</p>
              </div>
            )}
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-quiztopia-primary hover:bg-quiztopia-primary/90',
                  footerActionLink: 'text-quiztopia-primary',
                  card: 'shadow-none bg-transparent'
                }
              }}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
