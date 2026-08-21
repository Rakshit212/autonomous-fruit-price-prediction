import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock API delay
    setTimeout(() => {
      setIsSent(true);
      setIsLoading(false);
    }, 800);
  };

  return (
    <Card className="border-none shadow-none bg-transparent sm:bg-card sm:border-solid sm:shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Reset password</CardTitle>
        <CardDescription>
          Enter your email address and we will send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSent ? (
          <Alert className="bg-primary/5 border-primary/20">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary font-medium">
              Check your email for a reset link.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending link..." : "Send Reset Link"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
