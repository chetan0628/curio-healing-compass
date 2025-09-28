import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Info, Camera, Users, Shield } from 'lucide-react';

const About = () => {
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
            <span className="text-primary font-semibold">About</span>
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

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">About CURIO</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Healing With Data, Powered By Care</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            CURIO Healing Compass blends explainable AI with human-centered design to support everyday wound monitoring
            for patients and streamlined triage for healthcare providers.
          </p>
        </div>
      </section>

      {/* Feature Highlights (random info) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="medical-card p-6 text-center">
              <div className="w-14 h-14 bg-gradient-healing rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Daily Photo Check-ins</h3>
              <p className="text-sm text-muted-foreground">Quick snapshots help spot changes early and keep your care team in the loop.</p>
            </div>
            <div className="medical-card p-6 text-center">
              <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Care Team Coordination</h3>
              <p className="text-sm text-muted-foreground">Secure messaging and updates keep everyone aligned on healing goals.</p>
            </div>
            <div className="medical-card p-6 text-center">
              <div className="w-14 h-14 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">Encryption and role-based access help keep your health data safe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Random info blocks */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="medical-card p-6">
              <h4 className="text-xl font-semibold mb-2">Why it matters</h4>
              <p className="text-muted-foreground">
                Early detection reduces complications. CURIO provides timely insights and clear trends so action can be taken sooner.
              </p>
            </div>
            <div className="medical-card p-6">
              <h4 className="text-xl font-semibold mb-2">Designed with clinicians</h4>
              <p className="text-muted-foreground">
                Interfaces and alerts are co-created with providers to fit real workflows and reduce noise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="glass-card p-8 inline-block">
            <h3 className="text-2xl font-bold mb-2">Ready to try CURIO?</h3>
            <p className="text-muted-foreground mb-4">Start as a patient or sign in as a healthcare provider.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/patient/login">
                <Button className="gradient-healing text-white">Patient Login</Button>
              </Link>
              <Link to="/doctor/login">
                <Button variant="outline">Doctor Portal</Button>
              </Link>
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
            <p>© 2024 CURIO Healthcare Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
