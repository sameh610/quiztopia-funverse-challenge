
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Award, Clock, BookOpen, Trophy, Plus, Users, Gamepad } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-quiztopia-primary text-2xl font-bold text-white">
              JD
            </div>
            <div>
              <h1 className="text-3xl font-bold">John Doe</h1>
              <p className="text-muted-foreground">Quiz Master • Joined 2023</p>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,345</div>
              <p className="text-xs text-muted-foreground">+520 points this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Games Played</CardTitle>
              <Gamepad className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">Last played 2 hours ago</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes Created</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">5 public, 2 private</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Recent Activity</h2>
          <div className="rounded-lg border">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center">
                <Trophy className="mr-3 h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Won 1st Place</p>
                  <p className="text-sm text-muted-foreground">Classic Quiz Battle</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">2 hours ago</div>
            </div>
            
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center">
                <Plus className="mr-3 h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Created New Quiz</p>
                  <p className="text-sm text-muted-foreground">World Geography Masters</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Yesterday</div>
            </div>
            
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Users className="mr-3 h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Joined Team Battle</p>
                  <p className="text-sm text-muted-foreground">Science Quiz Championship</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">3 days ago</div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
