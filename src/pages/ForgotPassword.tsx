import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate network request
    await new Promise((r) => setTimeout(r, 1000));
    setStatus('sent');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-healing rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-primary">CURIO</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Forgot Password</h1>
          <p className="text-muted-foreground">We'll email you a secure link to reset your password.</p>
        </div>

        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Reset Access</CardTitle>
            <CardDescription>Enter the email you used for your account</CardDescription>
          </CardHeader>
          <CardContent>
            {status !== 'sent' ? (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50 border-border focus:border-primary"
                    required
                  />
                </div>
                <Button type="submit" className="w-full gradient-healing text-white hover:opacity-90 h-11">
                  {status === 'sending' ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <div className="text-center">
                  <Link to="/patient/login" className="text-sm text-primary hover:text-primary-glow">Back to Login</Link>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-foreground">If an account exists for <span className="font-semibold">{email}</span>, a reset link has been sent.</div>
                <div className="text-sm text-muted-foreground">Please check your inbox and spam folder.</div>
                <div className="flex gap-3 justify-center">
                  <Link to="/patient/login"><Button variant="outline">Return to Login</Button></Link>
                  <Button onClick={() => setStatus('idle')}>Send Again</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
