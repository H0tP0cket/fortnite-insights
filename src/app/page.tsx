import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn, BarChart3, TrendingUp, Map } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Map className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Map Oracle</h1>
          </div>
          <Link href="/login" passHref>
            <Button className="bg-primary hover:bg-primary/90">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Fortnite Map Insights
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover powerful analytics and player predictions for any Fortnite
            creative map. Get insights that help you understand player
            engagement and future trends.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Get Started now also goes to /login */}
            <Link href="/login" passHref>
              <Button size="lg" className="text-lg px-8 py-6">
                <LogIn className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
            <Link href="/login" passHref>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <BarChart3 className="w-10 h-10 text-primary mb-4" />
              <CardTitle>Map Analytics</CardTitle>
              <CardDescription>
                Enter any Fortnite map code and get detailed insights about
                player engagement, playtime, and performance metrics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <CardTitle>Player Predictions</CardTitle>
              <CardDescription>
                AI-powered predictions for how many players your map will
                attract over the next month based on trending data.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <Map className="w-10 h-10 text-primary mb-4" />
              <CardTitle>Personal Dashboard</CardTitle>
              <CardDescription>
                Set your display name, track your favorite maps, and build a
                personalized dashboard for all your map insights.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 Map Oracle. Insights for the creative community.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
