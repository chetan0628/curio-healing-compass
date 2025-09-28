import React, { useState, useReducer, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Camera, TrendingUp, Users, Calendar, AlertTriangle, CheckCircle, Heart,
  MessageCircle, Video, Menu, Bell, LogOut, Eye, EyeOff, Search, Filter,
  FileText, ChevronRight, Moon, Sun, Home, Info, X
} from 'lucide-react';
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';

// ==================== MOCK DATA SCHEMAS ====================
const mockPatientProfiles = [
  {
    id: 1, name: 'Sarah Johnson', email: 'sarah.johnson@email.com', age: 34,
    condition: 'Post-surgical wound', dateJoined: '2024-01-15', lastActive: '2024-01-29',
    healingScore: 85, riskLevel: 'low', streak: 10, totalPhotos: 25,
    careTeam: [
      { name: 'Dr. Sarah Chen', specialty: 'Wound Care Specialist', avatar: '👩‍⚕️', available: true },
      { name: 'Dr. Michael Torres', specialty: 'Dermatologist', avatar: '👨‍⚕️', available: false },
      { name: 'Lisa Johnson, RN', specialty: 'Wound Care Nurse', avatar: '👩‍⚕️', available: true }
    ]
  },
  {
    id: 2, name: 'Michael Chen', email: 'michael.chen@email.com', age: 58,
    condition: 'Diabetic ulcer', dateJoined: '2024-01-22', lastActive: '2024-01-28',
    healingScore: 35, riskLevel: 'high', streak: 3, totalPhotos: 12,
    careTeam: [{ name: 'Dr. Maria Santos', specialty: 'Endocrinologist', avatar: '👩‍⚕️', available: true }]
  }
];

const mockDoctorProfiles = [{
  id: 1, name: 'Dr. Maria Santos', email: 'maria.santos@hospital.com',
  specialty: 'Wound Care Specialist', license: 'MD12345', hospital: 'General Medical Center',
  experience: 12, patients: mockPatientProfiles, notifications: 3
}];

const healingProgressData = [
  { date: '2024-01-01', score: 25, risk: 'high' },
  { date: '2024-01-08', score: 35, risk: 'moderate' },
  { date: '2024-01-15', score: 50, risk: 'moderate' },
  { date: '2024-01-22', score: 68, risk: 'low' },
  { date: '2024-01-29', score: 85, risk: 'low' },
];

// ==================== STATE MANAGEMENT ====================
const initialState = {
  currentView: 'login', userType: null, currentUser: null, isDarkMode: false,
  isLoading: false, error: null, selectedPatient: null, searchQuery: '', filterRisk: 'all'
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW': return { ...state, currentView: action.payload, error: null };
    case 'SET_USER': return { ...state, currentUser: action.payload, userType: action.userType };
    case 'SET_LOADING': return { ...state, isLoading: action.payload };
    case 'SET_ERROR': return { ...state, error: action.payload, isLoading: false };
    case 'TOGGLE_DARK_MODE': return { ...state, isDarkMode: !state.isDarkMode };
    case 'SET_SELECTED_PATIENT': return { ...state, selectedPatient: action.payload };
    case 'SET_SEARCH_QUERY': return { ...state, searchQuery: action.payload };
    case 'SET_FILTER_RISK': return { ...state, filterRisk: action.payload };
    case 'LOGOUT': return { ...initialState };
    default: return state;
  }
}

// ==================== MAIN APP COMPONENT ====================
const ComprehensiveApp = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', showPassword: false });

  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  // ==================== UTILITY FUNCTIONS ====================
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'healing-good';
      case 'moderate': return 'healing-moderate';
      case 'high': return 'healing-critical';
      default: return 'healing-good';
    }
  };

  const getRiskText = (risk) => {
    switch (risk) {
      case 'low': return 'Low Risk - Great Progress!';
      case 'moderate': return 'Moderate Risk - Keep Monitoring';
      case 'high': return 'High Risk - Contact Doctor';
      default: return 'Assessment Pending';
    }
  };

  const getRiskBadgeVariant = (risk) => {
    switch (risk) {
      case 'low': return 'default';
      case 'moderate': return 'secondary';
      case 'high': return 'destructive';
      default: return 'default';
    }
  };

  // ==================== CHAT WIDGET (GEMINI) ====================
  const ChatWidget = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
      { role: 'assistant', content: 'Hi! I\'m CURIO Assistant. Ask me about wound care, dashboards, or using the app.' }
    ]);

    const geminiApiKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY)
      || (typeof window !== 'undefined' && window.__GEMINI_API_KEY)
      || '';

    const callGemini = async (userText) => {
      if (!geminiApiKey) {
        // Fallback mock when no key is provided
        await new Promise(r => setTimeout(r, 400));
        return 'I\'m running in demo mode. To enable live AI answers, add VITE_GEMINI_API_KEY.';
      }
      const body = {
        contents: [
          {
            role: 'user',
            parts: [{ text: userText }]
          }
        ]
      };
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || 'Gemini request failed');
      }
      const data = await resp.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      return text;
    };

    const send = async () => {
      const content = input.trim();
      if (!content || loading) return;
      setMessages(prev => [...prev, { role: 'user', content }]);
      setInput('');
      setLoading(true);
      try {
        const answer = await callGemini(content);
        setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
      } catch (e) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I could not process that right now.' }]);
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <div className="fixed bottom-4 right-4 z-[60]">
          {!open && (
            <Button className="rounded-full h-12 w-12 shadow-lg gradient-healing text-white" onClick={() => setOpen(true)} aria-label="Open chat">
              <MessageCircle className="w-6 h-6" />
            </Button>
          )}
        </div>
        {open && (
          <div className="fixed bottom-4 right-4 z-[60] w-80 max-w-[92vw]">
            <Card className="shadow-2xl">
              <CardHeader className="py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base">CURIO Assistant</CardTitle>
                <Button size="icon" variant="ghost" onClick={() => setOpen(false)} aria-label="Close chat">
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-56 overflow-y-auto space-y-3 pr-2">
                  {messages.map((m, i) => (
                    <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                      <div className={`inline-block px-3 py-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="text-left text-sm text-muted-foreground">Thinking…</div>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your healing…"
                    onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                  />
                  <Button onClick={send} disabled={loading || !input.trim()}>Send</Button>
                </div>
                {!geminiApiKey && (
                  <div className="text-[11px] text-muted-foreground mt-2">
                    Running in demo mode. Set <code>VITE_GEMINI_API_KEY</code> to enable live AI.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </>
    );
  };

  // ==================== AUTH HANDLERS ====================
  const handleLogin = async (e, userType) => {
    e.preventDefault();
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (userType === 'patient') {
        const patient = mockPatientProfiles.find(p => p.email === loginForm.email);
        if (patient) {
          dispatch({ type: 'SET_USER', payload: patient, userType: 'patient' });
          dispatch({ type: 'SET_VIEW', payload: 'patientDashboard' });
        } else {
          throw new Error('Patient not found');
        }
      } else if (userType === 'doctor') {
        const doctor = mockDoctorProfiles.find(d => d.email === loginForm.email);
        if (doctor) {
          dispatch({ type: 'SET_USER', payload: doctor, userType: 'doctor' });
          dispatch({ type: 'SET_VIEW', payload: 'doctorDashboard' });
          dispatch({ type: 'SET_SELECTED_PATIENT', payload: doctor.patients[0] });
        } else {
          throw new Error('Doctor not found');
        }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    setLoginForm({ email: '', password: '', showPassword: false });
  };

  // ==================== VIEW COMPONENTS ====================
  const LoginView = () => (
    <div className="min-h-screen flex items-center justify-center cell-regeneration-bg relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-healing rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-primary">CURIO</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 animate-fade-slide-in">
            Healing Compass Platform
          </h1>
          <p className="text-muted-foreground animate-fade-slide-in">
            AI-Powered Wound Monitoring & Care
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'about' })} variant="outline" className="h-12">
            <Info className="w-4 h-4 mr-2" /> About
          </Button>
          <Button onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })} variant="outline" className="h-12">
            {state.isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
            {state.isDarkMode ? 'Light' : 'Dark'}
          </Button>
        </div>

        <div className="space-y-4">
          <Card className="glass-card animate-fade-slide-in">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-foreground">Patient Portal</CardTitle>
              <CardDescription>Access your personalized wound monitoring dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleLogin(e, 'patient')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-email" className="text-foreground">Email Address</Label>
                  <Input
                    id="patient-email" type="email" placeholder="sarah.johnson@email.com"
                    value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className="bg-background/50 border-border focus:border-primary" required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Input
                      id="patient-password" type={loginForm.showPassword ? "text" : "password"}
                      placeholder="Enter your password" value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      className="bg-background/50 border-border focus:border-primary pr-10" required
                    />
                    <button type="button"
                      onClick={() => setLoginForm({...loginForm, showPassword: !loginForm.showPassword})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {loginForm.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-healing text-white hover:opacity-90 h-12" disabled={state.isLoading}>
                  {state.isLoading ? 'Signing In...' : 'Patient Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {recentUploads && recentUploads.length > 0 && (
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
                <CardDescription>Latest images you added for analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {recentUploads.map((item) => (
                    <div key={item.id} className="rounded-lg overflow-hidden border border-border bg-muted/20">
                      <img src={item.url} alt="Recent upload" className="w-full h-24 object-cover" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="glass-card animate-fade-slide-in">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-foreground">Doctor Portal</CardTitle>
              <CardDescription>Access clinical dashboard and patient monitoring tools</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleLogin(e, 'doctor')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor-email" className="text-foreground">Medical Email</Label>
                  <Input
                    id="doctor-email" type="email" placeholder="maria.santos@hospital.com"
                    value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className="bg-background/50 border-border focus:border-primary" required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-password" className="text-foreground">Secure Password</Label>
                  <div className="relative">
                    <Input
                      id="doctor-password" type={loginForm.showPassword ? "text" : "password"}
                      placeholder="Enter your secure password" value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      className="bg-background/50 border-border focus:border-primary pr-10" required
                    />
                    <button type="button"
                      onClick={() => setLoginForm({...loginForm, showPassword: !loginForm.showPassword})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {loginForm.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-secondary hover:bg-secondary-light text-secondary-foreground h-12" disabled={state.isLoading}>
                  {state.isLoading ? 'Signing In...' : 'Doctor Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {state.error && (
          <Card className="mt-4 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">{state.error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6 bg-muted/30">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">Demo Credentials:</h4>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p><strong>Patient:</strong> sarah.johnson@email.com</p>
              <p><strong>Doctor:</strong> maria.santos@hospital.com</p>
              <p><strong>Password:</strong> Any password works for demo</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // ==================== ABOUT VIEW ====================
  const AboutView = () => (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-healing rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-primary">CURIO</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Dark Mode</span>
              <Switch
                checked={state.isDarkMode}
                onCheckedChange={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <Button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'login' })} variant="outline">
              <Home className="w-4 h-4 mr-2" /> Back to Login
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">About CURIO Healing Compass</h1>
            <p className="text-xl text-muted-foreground">AI-Powered Wound Monitoring & Healthcare Platform</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-primary" />
                  For Patients
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Track your healing journey with AI-powered photo analysis, personalized insights, and direct communication with your care team.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-healing-good" />
                    Daily photo capture and analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-healing-good" />
                    Healing progress tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-healing-good" />
                    Care team communication
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-secondary" />
                  For Healthcare Providers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Monitor multiple patients efficiently with AI-assisted triage, comprehensive analytics, and streamlined clinical workflows.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-healing-good" />
                    Patient triage and monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-healing-good" />
                    AI-powered risk assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-healing-good" />
                    Clinical dashboard tools
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="medical-card-elevated">
            <CardHeader>
              <CardTitle className="text-center">Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-healing rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">AI Photo Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced computer vision analyzes wound photos for healing progress and risk factors.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-healing rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Progress Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive analytics and visualizations track healing over time.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-healing rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Care Coordination</h3>
                  <p className="text-sm text-muted-foreground">
                    Seamless communication between patients and healthcare providers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>Improving outcomes through early detection and continuous care</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                CURIO Healing Compass empowers patients and clinicians with AI insights that promote timely interventions,
                accelerate healing, and reduce complications.
              </p>
              <p>
                We believe great healthcare is proactive, data-driven, and compassionate. Our tools are designed to fit
                naturally into daily routines for maximum adherence and impact.
              </p>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="grid md:grid-cols-4 gap-4 text-sm">
                <li className="p-4 rounded-lg bg-muted/30">
                  <div className="font-semibold mb-1">1. Capture</div>
                  Take a clear photo of the wound daily.
                </li>
                <li className="p-4 rounded-lg bg-muted/30">
                  <div className="font-semibold mb-1">2. Analyze</div>
                  The AI evaluates tissue, edges, and color trends.
                </li>
                <li className="p-4 rounded-lg bg-muted/30">
                  <div className="font-semibold mb-1">3. Track</div>
                  View progress charts, streaks, and milestones.
                </li>
                <li className="p-4 rounded-lg bg-muted/30">
                  <div className="font-semibold mb-1">4. Act</div>
                  Get guidance and connect with your care team.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Security & Privacy</CardTitle>
              <CardDescription>Patient-first protection by design</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <li className="p-3 rounded-lg bg-muted/30">End-to-end encryption in transit and at rest</li>
                <li className="p-3 rounded-lg bg-muted/30">Role-based access control for providers</li>
                <li className="p-3 rounded-lg bg-muted/30">Audit logging for clinical actions</li>
                <li className="p-3 rounded-lg bg-muted/30">Configurable data retention policies</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Technology</CardTitle>
              <CardDescription>Modern, reliable, and scalable architecture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="font-semibold mb-1">Frontend</div>
                  React, Tailwind, shadcn/ui
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="font-semibold mb-1">Analytics</div>
                  Recharts, custom ML insights
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="font-semibold mb-1">Security</div>
                  OAuth, RBAC, audit trails
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card-elevated">
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">Have questions or want a demo?</div>
                <div className="text-sm text-muted-foreground">Contact our team: support@curio-health.com</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => dispatch({ type: 'SET_VIEW', payload: 'login' })}>
                  <Home className="w-4 h-4 mr-2" /> Back to Login
                </Button>
                <Button className="gradient-healing text-white" onClick={() => dispatch({ type: 'SET_VIEW', payload: 'login' })}>
                  Get Started
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // ==================== PATIENT DASHBOARD VIEW ====================
  const PatientDashboardView = () => {
    const patient = state.currentUser;
    const currentScore = patient.healingScore;
    const riskLevel = patient.riskLevel;
    const streak = patient.streak;
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [recentUploads, setRecentUploads] = useState([]);
    const fileInputRef = useRef(null);
    const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:8000';

    useEffect(() => {
      const onKeyDown = (e) => {
        const isLogoutCombo = (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'L' || e.key === 'l');
        if (isLogoutCombo) {
          e.preventDefault();
          handleLogout();
        }
      };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const onPickPhoto = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };


    const onPhotoChange = (e) => {
      const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
      if (file) {
        const isJpg = file.type === 'image/jpeg' || /\.jpe?g$/i.test(file.name || '');
        if (!isJpg) {
          setSelectedPhoto(null);
          setPhotoPreviewUrl(null);
          setUploadMessage('Only JPG images are allowed. Please select a .jpg file.');
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }
        setSelectedPhoto(file);
        const url = URL.createObjectURL(file);
        setPhotoPreviewUrl(url);
        setUploadMessage(null);
      } else {
        setSelectedPhoto(null);
        setPhotoPreviewUrl(null);
      }
    };

    const onDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0] ? e.dataTransfer.files[0] : null;
      if (file) {
        const isJpg = file.type === 'image/jpeg' || /\.jpe?g$/i.test(file.name || '');
        if (!isJpg) {
          setSelectedPhoto(null);
          setPhotoPreviewUrl(null);
          setUploadMessage('Only JPG images are allowed. Please drop a .jpg file.');
          return;
        }
        setSelectedPhoto(file);
        const url = URL.createObjectURL(file);
        setPhotoPreviewUrl(url);
        setUploadMessage(null);
      }
    };

    const onDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const openFilePicker = () => {
      // Primary: click via ref
      if (fileInputRef.current && typeof fileInputRef.current.click === 'function') {
        try {
          fileInputRef.current.click();
          return;
        } catch (e) {
          // fall through to fallback
        }
      }
      // Fallback: query by id and dispatch a click
      const el = document.getElementById('patient-photo-input');
      if (el && typeof el.click === 'function') {
        el.click();
        return;
      }
      // Last resort: synthesize a click event
      if (fileInputRef.current) {
        const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        fileInputRef.current.dispatchEvent(evt);
      }
    };

    const uploadToBackend = async (file) => {
      const fd = new FormData();
      fd.append('file', file);
      const resp = await fetch(`${API_BASE}/api/v1/wounds/upload`, {
        method: 'POST',
        body: fd,
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || 'Upload failed');
      }
      return resp.json();
    };

    const onConfirmUpload = async () => {
      if (!selectedPhoto) return;
      try {
        setIsUploading(true);
        // Send to backend
        const data = await uploadToBackend(selectedPhoto);
        // Client-side quick analysis preview (optional for demo)
        await analyzeSelectedPhoto(selectedPhoto);
        setUploadMessage(`Uploaded successfully: ${data?.filename || 'image'}`);
        // Persist to recent uploads list (keep latest 6)
        setRecentUploads((prev) => {
          const entry = {
            id: Date.now(),
            url: photoPreviewUrl,
            timestamp: new Date().toISOString(),
            analysis: analysisResult,
          };
          const next = [entry, ...prev].slice(0, 6);
          return next;
        });
        // Optionally clear selection after upload
        // setSelectedPhoto(null);
        // setPhotoPreviewUrl(null);
      } finally {
        setIsUploading(false);
      }
    };

    const onClearSelection = () => {
      setSelectedPhoto(null);
      setPhotoPreviewUrl(null);
      setUploadMessage(null);
      setAnalysisResult(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const analyzeSelectedPhoto = async (file) => {
      try {
        setIsAnalyzing(true);
        // Read file as data URL
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        // Load image to get dimensions
        const dims = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.width, height: img.height });
          img.onerror = reject;
          img.src = dataUrl;
        });
        // Mock metrics
        const sizeKB = Math.round(file.size / 1024);
        const score = Math.min(100, Math.max(0, Math.round(70 + (Math.random() * 20 - 10))));
        const redness = Math.round(10 + Math.random() * 30);
        const infectionRisk = score > 65 ? 'low' : score > 45 ? 'moderate' : 'high';
        setAnalysisResult({
          preview: dataUrl,
          width: dims.width,
          height: dims.height,
          sizeKB,
          score,
          redness,
          infectionRisk,
        });
      } finally {
        setIsAnalyzing(false);
      }
    };

    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-healing rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-primary">CURIO</span>
              <span className="text-muted-foreground ml-4">Patient Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></div>
              </Button>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">Welcome back, {patient.name}</p>
                <p className="text-xs text-muted-foreground">Last photo: Today</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => dispatch({ type: 'SET_VIEW', payload: 'about' })}>
                <Info className="w-4 h-4 mr-2" /> About
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout (Ctrl+Shift+L)" aria-label="Logout">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6 space-y-8">
          <Card className="medical-card-elevated pulse-border">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 bg-gradient-healing rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Capture Today's Healing Update
              </h2>
              <p className="text-muted-foreground mb-6">
                Consistency is key for best AI analysis results
              </p>
              <div
                className="mx-auto max-w-xl mb-4 p-4 border-2 border-dashed border-border rounded-lg text-center text-sm text-muted-foreground hover:border-primary/50"
                onDrop={onDrop}
                onDragOver={onDragOver}
              >
                Drag & drop an image here to analyze, or use the buttons below
              </div>
              {photoPreviewUrl && (
                <div className="mx-auto max-w-xs mb-4">
                  <div className="text-sm text-muted-foreground mb-2">Selected photo preview:</div>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <img src={photoPreviewUrl} alt="Selected wound" className="w-full h-auto object-contain" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Button size="sm" className="gradient-healing text-white" onClick={onConfirmUpload} disabled={isUploading}>
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={onClearSelection} disabled={isUploading}>
                      Clear
                    </Button>
                  </div>
                  {uploadMessage && (
                    <div className="text-sm text-healing-good text-center mt-2">{uploadMessage}</div>
                  )}
                  {analysisResult && (
                    <div className="mt-3 p-3 rounded-lg border border-border bg-muted/30 text-sm text-foreground">
                      <div className="font-semibold mb-1">Analysis</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>Dimensions: {analysisResult.width}×{analysisResult.height}px</div>
                        <div>Size: {analysisResult.sizeKB} KB</div>
                        <div>Healing Score: {analysisResult.score}%</div>
                        <div>Redness: {analysisResult.redness}%</div>
                        <div>Risk: {analysisResult.infectionRisk}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="gradient-healing text-white hover:opacity-90 text-lg px-8"
                  onClick={openFilePicker}
                >
                  Take Photo Now
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,.jpg,.jpeg"
                capture="environment"
                className="hidden"
                id="patient-photo-input"
                onChange={onPhotoChange}
              />
              <p className="text-sm text-muted-foreground mt-4">
                📸 Last photo taken: This morning at 9:30 AM
              </p>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    Healing Progress
                  </CardTitle>
                  <CardDescription>AI-powered healing assessment over time</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary">{currentScore}%</div>
                  <Badge className={`${getRiskColor(riskLevel)} text-white mt-1`}>
                    {getRiskText(riskLevel)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healingProgressData}>
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      domain={[0, 100]}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="glass-card p-4">
                              <p className="text-foreground font-medium">
                                {new Date(label).toLocaleDateString()}
                              </p>
                              <p className="text-primary font-bold">
                                Healing Score: {data.score}%
                              </p>
                              <Badge className={`${getRiskColor(data.risk)} text-white mt-1`}>
                                {getRiskText(data.risk)}
                              </Badge>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={(props) => {
                        const risk = props.payload?.risk;
                        const color = risk === 'high' ? 'hsl(var(--healing-critical))' :
                                     risk === 'moderate' ? 'hsl(var(--healing-moderate))' :
                                     'hsl(var(--healing-good))';
                        return <circle {...props} fill={color} r={6} stroke={color} strokeWidth={2} />;
                      }}
                    />
                    <ReferenceLine y={50} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-healing-good">
                  <CheckCircle className="w-6 h-6" />
                  Amazing Progress!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-gradient-healing rounded-lg text-white">
                    <div className="text-3xl font-bold mb-2">{streak} Day Streak!</div>
                    <p className="text-white/90">Keep up the excellent consistency</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to next milestone</span>
                      <span>8/10 days</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  My Care Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patient.careTeam.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{member.avatar}</div>
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={member.available ? "default" : "secondary"}>
                          {member.available ? "Available" : "Busy"}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost" className="p-2">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-2">
                            <Video className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <ChatWidget />
      </div>
    );
  };

  // ==================== DOCTOR DASHBOARD VIEW ====================
  const DoctorDashboardView = () => {
    const doctor = state.currentUser;
    const patients = doctor.patients;
    
    const filteredPatients = patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                           patient.condition.toLowerCase().includes(state.searchQuery.toLowerCase());
      const matchesFilter = state.filterRisk === 'all' || patient.riskLevel === state.filterRisk;
      return matchesSearch && matchesFilter;
    });

    const redAlerts = patients.filter(p => p.riskLevel === 'high').length;
    const yellowAlerts = patients.filter(p => p.riskLevel === 'moderate').length;

    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-healing rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-primary">CURIO</span>
              </div>
              <div className="hidden md:block text-muted-foreground">Clinical Dashboard</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Dark Mode</span>
                <Switch
                  checked={state.isDarkMode}
                  onCheckedChange={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              <Button variant="ghost" className="relative">
                <Bell className="w-5 h-5" />
                {(redAlerts + yellowAlerts) > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs text-white flex items-center justify-center">
                    {redAlerts + yellowAlerts}
                  </div>
                )}
              </Button>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{doctor.name}</p>
                <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => dispatch({ type: 'SET_VIEW', payload: 'about' })}>
                <Info className="w-4 h-4 mr-2" /> About
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Triage Panel */}
            <div className="lg:col-span-3">
              <Card className="medical-card mb-6 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Patient Triage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-medium">Total Patients</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">{patients.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      <span className="font-medium">Red Alerts</span>
                    </div>
                    <span className="text-2xl font-bold text-destructive">{redAlerts}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span className="font-medium">Yellow Alerts</span>
                    </div>
                    <span className="text-2xl font-bold text-amber-600">{yellowAlerts}</span>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium mb-3">Quick Filters</h4>
                    <div className="space-y-2">
                      <Button
                        variant={state.filterRisk === 'high' ? 'destructive' : 'outline'}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => dispatch({ type: 'SET_FILTER_RISK', payload: state.filterRisk === 'high' ? 'all' : 'high' })}
                      >
                        Show Red Alerts Only
                      </Button>
                      <Button
                        variant={state.filterRisk === 'moderate' ? 'secondary' : 'outline'}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => dispatch({ type: 'SET_FILTER_RISK', payload: state.filterRisk === 'moderate' ? 'all' : 'moderate' })}
                      >
                        Show Yellow Alerts Only
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Patient List */}
            <div className="lg:col-span-5">
              <Card className="medical-card">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Patient Monitor</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search patients..."
                          value={state.searchQuery}
                          onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button size="sm" variant="outline">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        onClick={() => dispatch({ type: 'SET_SELECTED_PATIENT', payload: patient })}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          state.selectedPatient?.id === patient.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-foreground">{patient.name}</h4>
                              <Badge variant={getRiskBadgeVariant(patient.riskLevel)}>
                                {patient.riskLevel.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{patient.condition}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Last photo: {new Date(patient.lastActive).toLocaleDateString()}</span>
                              <span className="font-medium text-primary">{patient.healingScore}% healed</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                {Math.floor((new Date() - new Date(patient.dateJoined)) / (1000 * 60 * 60 * 24))} days active
                              </span>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Patient Detail Panel */}
            <div className="lg:col-span-4">
              {state.selectedPatient && (
                <div className="space-y-6">
                  <Card className="medical-card-elevated">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">{state.selectedPatient.name}</CardTitle>
                          <CardDescription>{state.selectedPatient.condition}</CardDescription>
                        </div>
                        <Badge 
                          className={`${getRiskColor(state.selectedPatient.riskLevel)} text-white text-lg px-4 py-2`}
                        >
                          {state.selectedPatient.healingScore}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Risk Level:</span>
                          <Badge variant={getRiskBadgeVariant(state.selectedPatient.riskLevel)}>
                            {state.selectedPatient.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Last Photo:</span>
                          <span className="font-medium">
                            {new Date(state.selectedPatient.lastActive).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Monitoring Days:</span>
                          <span className="font-medium">
                            {Math.floor((new Date() - new Date(state.selectedPatient.dateJoined)) / (1000 * 60 * 60 * 24))} days
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="medical-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Healing Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={healingProgressData}>
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(date) => new Date(date).toLocaleDateString()}
                              stroke="hsl(var(--muted-foreground))"
                            />
                            <YAxis 
                              domain={[0, 100]}
                              stroke="hsl(var(--muted-foreground))"
                            />
                            <Tooltip 
                              content={({ active, payload, label }) => {
                                if (active && payload && payload[0]) {
                                  return (
                                    <div className="glass-card p-3">
                                      <p className="text-foreground font-medium">
                                        {new Date(label).toLocaleDateString()}
                                      </p>
                                      <p className="text-primary font-bold">
                                        Score: {payload[0].value}%
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="score" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={2}
                              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="medical-card">
                    <CardHeader>
                      <CardTitle>Patient Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-3">
                        <Button className="gradient-healing text-white hover:opacity-90">
                          <Video className="w-4 h-4 mr-2" />
                          Start Video Consult
                        </Button>
                        <Button variant="outline">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Send Secure Message
                        </Button>
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Photo History
                        </Button>
                        <Button variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Add Clinical Note
                        </Button>
                        <Button variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule Follow-up
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
        <ChatWidget />
      </div>
    );
  };

  // ==================== RENDER MAIN APP ====================
  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'login': return <LoginView />;
      case 'about': return <AboutView />;
      case 'patientDashboard': return <PatientDashboardView />;
      case 'doctorDashboard': return <DoctorDashboardView />;
      default: return <LoginView />;
    }
  };

  return <div className="app-container">{renderCurrentView()}</div>;
};

export default ComprehensiveApp;
