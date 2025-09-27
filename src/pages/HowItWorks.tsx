import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Camera, Brain, TrendingUp, Video } from 'lucide-react';

const HowItWorks = () => {
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
            <Link to="/how-it-works" className="text-primary font-semibold">How It Works</Link>
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
      <section className="py-16 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How <span className="text-transparent bg-gradient-healing bg-clip-text">CURIO</span> Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            From photo capture to AI analysis, discover how our platform transforms wound monitoring into a seamless, data-driven healthcare experience.
          </p>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            
            {/* Step 1 */}
            <div className="medical-card-elevated p-8 animate-fade-slide-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-healing rounded-full flex items-center justify-center flex-shrink-0">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary mb-1">STEP 1</div>
                  <h3 className="text-2xl font-bold text-foreground">Snap & Secure</h3>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-lg text-muted-foreground mb-4">
                    Patients use their smartphone camera to take a daily photo of the wound. The app automatically aligns and uploads the image securely.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Smart auto-alignment guides
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      End-to-end encryption
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Instant cloud backup
                    </li>
                  </ul>
                </div>
                <div className="glass-card p-8 text-center">
                  <div className="w-24 h-24 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center pulse-border">
                    <Camera className="w-12 h-12 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Secure Photo Capture</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="medical-card-elevated p-8 animate-fade-slide-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="w-8 h-8 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-accent mb-1">STEP 2</div>
                  <h3 className="text-2xl font-bold text-foreground">AI-Powered Clarity</h3>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="glass-card p-8 text-center md:order-first">
                  <div className="w-24 h-24 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Brain className="w-12 h-12 text-accent animate-pulse" />
                  </div>
                  <p className="text-sm text-muted-foreground">Explainable AI Analysis</p>
                </div>
                <div>
                  <p className="text-lg text-muted-foreground mb-4">
                    Our Explainable AI (XAI) instantly analyzes the image for size reduction, tissue changes, redness, and signs of infection.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      Wound measurement precision
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      Tissue health assessment
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      Infection risk detection
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="medical-card-elevated p-8 animate-fade-slide-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-secondary-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-secondary mb-1">STEP 3</div>
                  <h3 className="text-2xl font-bold text-foreground">Track Progress & Alert</h3>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-lg text-muted-foreground mb-4">
                    The app generates an animated healing graph/score and sends immediate alerts to the patient and doctor if a high-risk change is detected.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      Real-time healing scores
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      Interactive progress graphs
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      Instant risk alerts
                    </li>
                  </ul>
                </div>
                <div className="glass-card p-8 text-center">
                  <div className="w-full h-16 bg-gradient-progress rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-white font-bold">85% Healed</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Progress Tracking</p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="medical-card-elevated p-8 animate-fade-slide-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-healing rounded-full flex items-center justify-center flex-shrink-0">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary mb-1">STEP 4</div>
                  <h3 className="text-2xl font-bold text-foreground">Connect & Intervene</h3>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="glass-card p-8 text-center md:order-first">
                  <div className="w-24 h-24 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Video className="w-12 h-12 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Remote Care Connection</p>
                </div>
                <div>
                  <p className="text-lg text-muted-foreground mb-4">
                    Doctors review the data and photos via their secure portal and initiate chat or video consultations for early, data-driven intervention.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Secure doctor portal access
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Instant video consultations
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Early intervention protocols
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Start Your Healing Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of patients and healthcare providers who trust CURIO for advanced wound monitoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/patient/login">
              <Button size="lg" className="w-full sm:w-auto gradient-healing text-white hover:opacity-90">
                Start as Patient
              </Button>
            </Link>
            <Link to="/doctor/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Join as Healthcare Provider
              </Button>
            </Link>
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

export default HowItWorks;