"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "http://localhost:3000/dashboard" },
    });
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("check your email for login link!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" passHref>
            <div className="flex items-center space-x-2">
              <Map className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Map Oracle</h1>
            </div>
          </Link>
        </div>
      </header>

      {/* Login Form Section */}
      <section className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 rounded-xl text-black border-2 focus:outline-none focus:ring-0"
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Sending…" : "Send Email"}
              </Button>
            </form>
            {message && <p className="mt-4 text-center text-sm">{message}</p>}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              After clicking the link in your email, you’ll be redirected to
              your dashboard.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 Map Oracle. Insights for the creative community.</p>
        </div>
      </footer>
    </div>
  );
}
