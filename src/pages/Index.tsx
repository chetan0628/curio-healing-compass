import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Brain, Users } from 'lucide-react';
import heroImage from '@/assets/hero-healing.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-healing rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-primary">CURIO</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">About</Link>
            <Link to="/how-it-works" className="text-foreground hover:text-primary transition-colors">How It Works</Link>
            <Link to="/doctors" className="text-foreground hover:text-primary transition-colors">Find Doctors</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/patient/login">
              <Button variant="outline" className="hidden sm:inline-flex">Patient Login</Button>
            </Link>
            <Link to="/doctor/login">
              <Button className="bg-secondary hover:bg-secondary-light text-secondary-foreground">Doctor Portal</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="AI-powered wound monitoring technology"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent"></div>
        </div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-slide-in">
              Clinical Clarity meets{' '}
              <span className="text-transparent bg-gradient-healing bg-clip-text">
                Digital Compassion
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-slide-in">
              Advanced AI-powered wound monitoring that transforms healing journeys for patients and healthcare providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-slide-in">
              <Link to="/patient/login">
                <Button size="lg" className="w-full sm:w-auto gradient-healing text-white hover:opacity-90">
                  Start Your Healing Journey
                </Button>
              </Link>
              <Link to="/doctor/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Healthcare Provider Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Revolutionizing Wound Care
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering patients and clinicians with AI-driven insights for better healing outcomes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="medical-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-healing rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">AI-Powered Analysis</h3>
              <p className="text-muted-foreground">Advanced computer vision provides precise wound assessment and healing predictions.</p>
            </div>
            
            <div className="medical-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Risk Detection</h3>
              <p className="text-muted-foreground">Early warning system identifies complications before they become critical.</p>
            </div>
            
            <div className="medical-card p-6 text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Care Team Connection</h3>
              <p className="text-muted-foreground">Seamless communication between patients and healthcare providers.</p>
            </div>
            
            <div className="medical-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-healing rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Patient Empowerment</h3>
              <p className="text-muted-foreground">Interactive tools and insights that put patients in control of their healing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">CURIO</span>
            </div>
            <div className="flex space-x-8">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-secondary-light/20 text-center text-secondary-foreground/70">
            <p>© 2024 CURIO Healthcare Platform. Advanced wound monitoring technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;