import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Heart, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import doctorBg from '@/assets/doctor-bg.jpg';

const DoctorLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Apply dark mode if selected
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Demo login - navigate to dashboard
    navigate('/doctor/dashboard');
  };

  const toggleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center data-stream-bg relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={doctorBg} 
          alt="Medical technology background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 via-secondary/60 to-secondary/80"></div>
      </div>

      {/* Animated AI Nodes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-healing rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">CURIO</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2 animate-fade-slide-in">
            Precision Monitoring
          </h1>
          <p className="text-white/80 animate-fade-slide-in">
            Powered by Advanced AI Technology
          </p>
        </div>

        {/* Login Card */}
        <Card className="glass-card animate-fade-slide-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Doctor Portal</CardTitle>
            <CardDescription>
              Access your clinical dashboard and patient monitoring tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Medical Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-border focus:border-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Secure Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50 border-border focus:border-primary pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  {darkMode ? <Moon className="w-5 h-5 text-foreground" /> : <Sun className="w-5 h-5 text-foreground" />}
                  <div>
                    <Label htmlFor="dark-mode" className="text-foreground font-medium">Clinical Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Optimized for extended use</p>
                  </div>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-secondary hover:bg-secondary-light text-secondary-foreground h-12 text-lg font-medium"
              >
                Access Clinical Dashboard
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <Link 
                  to="/doctor/forgot-password" 
                  className="text-primary hover:text-primary-glow transition-colors text-sm"
                >
                  Forgot credentials?
                </Link>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground">Healthcare Access</span>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Need institutional access?
                </p>
                <Link to="/doctor/signup">
                  <Button variant="outline" className="w-full">
                    Request Clinical Account
                  </Button>
                </Link>
              </div>
              
              <div className="text-center pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">
                  Are you a patient?
                </p>
                <Link to="/patient/login">
                  <Button variant="secondary" className="w-full">
                    Patient Portal Access
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="text-center mt-8 text-sm text-white/70">
          <p>🔒 HIPAA-compliant secure authentication</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;