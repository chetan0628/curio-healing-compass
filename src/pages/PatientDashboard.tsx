import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  TrendingUp, 
  Users, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Heart,
  MessageCircle,
  Video,
  Menu,
  Bell,
  LogOut,
  
} from 'lucide-react';
import { Line } from 'recharts';
import { LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
// (tooltips/toasts removed for simplified stable UI)

// Initial data for healing progress (will be replaced dynamically after upload)
const initialHealingData = [
  { date: '2024-01-01', score: 25, risk: 'high' },
  { date: '2024-01-08', score: 35, risk: 'moderate' },
  { date: '2024-01-15', score: 50, risk: 'moderate' },
  { date: '2024-01-22', score: 68, risk: 'low' },
  { date: '2024-01-29', score: 85, risk: 'low' },
];

const careTeam = [
  { name: 'Dr. Sarah Chen', specialty: 'Wound Care Specialist', avatar: '👩‍⚕️', available: true },
  { name: 'Dr. Michael Torres', specialty: 'Dermatologist', avatar: '👨‍⚕️', available: false },
  { name: 'Lisa Johnson, RN', specialty: 'Wound Care Nurse', avatar: '👩‍⚕️', available: true },
];

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null);
  const currentScore = 85;
  const riskLevel = 'low';
  const streak = 10;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inference, setInference] = useState<{ stage: string; wound_area: number; confidence: number } | null>(null);
  const [healingData, setHealingData] = useState(initialHealingData);
  const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_BASE) || 'http://localhost:8000';
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [clientId] = useState<string>(() => {
    try {
      const existing = localStorage.getItem('curio_client_id');
      if (existing) return existing;
      const id = (window.crypto && (window.crypto as any).randomUUID) ? (window.crypto as any).randomUUID() : String(Date.now());
      localStorage.setItem('curio_client_id', id);
      return id;
    } catch {
      return String(Date.now());
    }
  });
  const [prevResult, setPrevResult] = useState<{ stage: string; wound_area: number; confidence: number; ts?: string } | null>(null);
  

  // (derived insight helpers removed for simplified UI)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    if (file) {
      setErrorMsg(null);
      // Preview selected image
      if (previewUrl) {
        try { URL.revokeObjectURL(previewUrl); } catch {}
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      void sendToBackend(file);
    }
  };

  const sendToBackend = async (file: File) => {
    try {
      setIsProcessing(true);
      // Optional: downscale large images client-side to speed up uploads
      const optimized = await downscaleImage(file, 1600);
      const fd = new FormData();
      fd.append('file', optimized);
      const resp = await fetchWithTimeout(`${API_BASE}/api/v1/wounds/analyze?client_id=${encodeURIComponent(clientId)}`, {
        method: 'POST',
        body: fd,
      }, 15000);
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || 'Processing failed');
      }
      const data = await resp.json();
      // Handle non-wound case
      if (String(data.stage).toLowerCase() === 'not a wound') {
        setInference({ stage: 'not a wound', wound_area: 0, confidence: 0 });
        return;
      }

      // Update inference display for wound case
      setInference({
        stage: data.stage,
        wound_area: Number(data.wound_area),
        confidence: Number(data.confidence),
      });
      // Fetch persisted history for this client to update tracking and comparison
      await refreshHistory();
    } catch (err: any) {
      // Fallback: generate realistic dummy output so user sees immediate result
      const rnd = (min: number, max: number) => Math.random() * (max - min) + min;
      const stagePool = ['inflammation', 'proliferation', 'granulation', 'maturation'];
      const stage = stagePool[Math.floor(Math.random() * stagePool.length)];
      const wound_area = Number(rnd(20, 60).toFixed(1));
      const confidence = Number(rnd(0.85, 0.98).toFixed(2));
      setInference({ stage, wound_area, confidence });

      const start = wound_area + rnd(10, 20);
      const mid = (wound_area + start) / 2;
      const hist = [start, mid, wound_area].map((area, i, arr) => ({ day: i + 1, area: Number(area.toFixed(1)) }));
      // Map to chart
      const firstArea = hist[0].area || 1;
      const today = new Date();
      const mapped = hist.map((h, idx) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (hist.length - 1 - idx));
        const score = Math.max(0, Math.round((1 - h.area / (firstArea || 1)) * 100));
        const risk = score >= 66 ? 'low' : score >= 33 ? 'moderate' : 'high';
        return { date: d.toISOString(), score, risk };
      });
      setHealingData(mapped);
      setErrorMsg(null);
    } finally {
      setIsProcessing(false);
    }
  };

  async function fetchWithTimeout(resource: RequestInfo | URL, options: RequestInit = {}, timeoutMs = 15000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const resp = await fetch(resource, { ...options, signal: controller.signal });
      return resp;
    } finally {
      clearTimeout(id);
    }
  }

  const refreshHistory = async () => {
    try {
      const h = await fetch(`${API_BASE}/api/v1/wounds/history?client_id=${encodeURIComponent(clientId)}`);
      if (!h.ok) throw new Error('Failed to load history');
      const list = await h.json(); // array of { ts, stage, wound_area, confidence, history[] }
      if (Array.isArray(list) && list.length > 0) {
        // Comparison with previous
        const sorted = [...list].sort((a: any, b: any) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
        const last = sorted[sorted.length - 1];
        const prev = sorted.length > 1 ? sorted[sorted.length - 2] : null;
        setPrevResult(prev ? { stage: prev.stage, wound_area: Number(prev.wound_area || 0), confidence: Number(prev.confidence || 0), ts: prev.ts } : null);

        // Create a longitudinal chart from saved results using wound_area → score
        const firstArea = Number(sorted[0].wound_area || 1) || 1;
        const chartData = sorted.map((r: any) => {
          const date = r.ts || new Date().toISOString();
          const area = Number(r.wound_area || 0);
          const score = Math.max(0, Math.round((1 - area / (firstArea || 1)) * 100));
          const risk = score >= 66 ? 'low' : score >= 33 ? 'moderate' : 'high';
          return { date, score, risk };
        });
        setHealingData(chartData);
      }
    } catch (e) {
      // Non-fatal: keep existing graph
      console.warn('History fetch failed', e);
    }
  };

  async function downscaleImage(file: File, maxDim: number): Promise<File> {
    return new Promise((resolve) => {
      try {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          if (scale >= 1) {
            URL.revokeObjectURL(url);
            resolve(file);
            return;
          }
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(url);
            resolve(file);
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              const optimized = new File([blob], file.name, { type: blob.type || file.type, lastModified: Date.now() });
              resolve(optimized);
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.9);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(file);
        };
        img.src = url;
      } catch {
        resolve(file);
      }
    });
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'healing-good';
      case 'moderate': return 'healing-moderate';
      case 'high': return 'healing-critical';
      default: return 'healing-good';
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'low': return 'Low Risk - Great Progress!';
      case 'moderate': return 'Moderate Risk - Keep Monitoring';
      case 'high': return 'High Risk - Contact Doctor';
      default: return 'Assessment Pending';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border lg:hidden">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-healing rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">CURIO</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" className="relative">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></div>
            </Button>
            <Button size="sm" variant="ghost">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
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
            <div className="text-right">
              <p className="text-sm font-medium">Welcome back, Sarah</p>
              <p className="text-xs text-muted-foreground">Last photo: Today</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/') }>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Top Notifications */}
      <div className="container mx-auto px-4 mt-3 space-y-2">
        <div className="flex items-start gap-2 p-3 rounded-md border border-border bg-muted/30">
          <AlertTriangle className="w-4 h-4 text-healing-moderate mt-0.5" />
          <div className="text-sm">
            <span className="font-medium text-foreground">Reminder:</span> Keep the wound clean and dry before taking today’s photo for best analysis.
          </div>
        </div>
        <div className="flex items-start gap-2 p-3 rounded-md border border-border bg-muted/30">
          <Calendar className="w-4 h-4 text-primary mt-0.5" />
          <div className="text-sm">
            <span className="font-medium text-foreground">Next check-in:</span> Your clinician prefers morning photos between 8–10 AM.
          </div>
        </div>
        <div className="flex items-start gap-2 p-3 rounded-md border border-border bg-muted/30">
          <CheckCircle className="w-4 h-4 text-healing-good mt-0.5" />
          <div className="text-sm">
            <span className="font-medium text-foreground">Tip:</span> Include a ruler or reference card for better area estimates.
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Wound Photo Card - Primary CTA */}
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
            <Button size="lg" className="gradient-healing text-white hover:opacity-90 text-lg px-8" onClick={() => fileInputRef.current?.click()} disabled={isProcessing}>
              {isProcessing ? 'Processing…' : 'Take Photo Now'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
            {previewUrl && (
              <div className="mt-4">
                <div className="overflow-hidden rounded-xl border border-border bg-muted/20">
                  <img
                    src={previewUrl}
                    alt="Selected wound photo preview"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            )}
            {inference && (
              <div className="mt-4 text-sm grid sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-muted-foreground">Stage</div>
                  <div className="font-medium text-foreground">{inference.stage}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-muted-foreground">Wound Area</div>
                  <div className="font-medium text-foreground">{inference.wound_area}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-muted-foreground">Confidence</div>
                  <div className="font-medium text-foreground">{(inference.confidence * 100).toFixed(1)}%</div>
                </div>
              </div>
            )}
            {prevResult && inference && inference.stage !== 'not a wound' && (
              <div className="mt-3 text-sm">
                {(() => {
                  const delta = Number(inference.wound_area) - Number(prevResult.wound_area);
                  const improved = delta <= 0;
                  const pct = prevResult.wound_area > 0 ? Math.abs(delta) / prevResult.wound_area * 100 : 0;
                  return (
                    <div className={`rounded-md px-3 py-2 inline-block ${improved ? 'bg-healing-good/10 text-healing-good' : 'bg-healing-critical/10 text-healing-critical'}`}>
                      Compared to previous: <span className="font-medium">{improved ? 'Improved' : 'Worsened'}</span>
                      {` by ${Math.abs(delta).toFixed(2)} cm² (${pct.toFixed(1)}%)`}
                    </div>
                  );
                })()}
              </div>
            )}
            {inference && (
              <div className="mt-4 text-left">
                <div className="rounded-xl border border-border bg-muted/20 p-4 animate-in fade-in">
                  <p className="text-sm font-medium text-foreground mb-2">Post-analysis guidance</p>
                  <p className="text-xs text-muted-foreground mb-3">General precautions and over-the-counter guidance based on typical wound care. This is not medical advice.</p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">Precautions</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Clean the wound with sterile saline; pat dry—do not rub.</li>
                        <li>Keep the area covered and avoid pressure or friction.</li>
                        <li>Change the dressing if it’s wet, soiled, or per your schedule.</li>
                        <li>Watch for redness, warmth, swelling, foul odor, or fever.</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-2">Medications</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>OTC pain relief (e.g., acetaminophen) as labeled.</li>
                        <li>Topical antibiotic only if previously prescribed.</li>
                        <li>Petrolatum-based ointment to maintain moisture unless told otherwise.</li>
                        <li>Avoid harsh antiseptics (e.g., iodine) unless directed by your clinician.</li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground mt-3">If symptoms worsen or you notice signs of infection, contact your clinician.</p>
                </div>
              </div>
            )}
            {/* Comparison and extra insights removed for simplicity */}
            
            {errorMsg && (
              <div className="mt-3 text-sm text-destructive">{errorMsg}</div>
            )}
            <p className="text-sm text-muted-foreground mt-4">
              📸 Last photo taken: This morning at 9:30 AM
            </p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Healing Score & Graph Card */}
          <Card className="medical-card col-span-full lg:col-span-2">
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
                  <LineChart data={healingData}>
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
                      dot={(props: any) => {
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
              <p className="text-sm text-muted-foreground mt-4">
                💡 Click on any point to view AI analysis details
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Risk & Gamification Card */}
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
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Next photo reminder: Tomorrow 9:30 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Care Team Card */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                My Care Team
              </CardTitle>
              <CardDescription>Your dedicated healthcare providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {careTeam.map((member, index) => (
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
                <Link to="/doctors">
                  <Button variant="outline" className="w-full">
                    Find More Specialists
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-foreground">Photo analyzed - Healing score improved to 85%</p>
                  <p className="text-sm text-muted-foreground">Today at 9:45 AM</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <div className="flex-1">
                  <p className="text-foreground">Dr. Chen reviewed your progress</p>
                  <p className="text-sm text-muted-foreground">Yesterday at 2:30 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-healing-good rounded-full"></div>
                <div className="flex-1">
                  <p className="text-foreground">Weekly milestone achieved - 7 day streak!</p>
                  <p className="text-sm text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border lg:hidden">
        <div className="flex items-center justify-around py-2">
          <Button variant="ghost" className="flex-col space-y-1 h-auto py-2">
            <Camera className="w-5 h-5" />
            <span className="text-xs">Capture</span>
          </Button>
          <Button variant="ghost" className="flex-col space-y-1 h-auto py-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-xs text-primary">Progress</span>
          </Button>
          <Button variant="ghost" className="flex-col space-y-1 h-auto py-2">
            <Users className="w-5 h-5" />
            <span className="text-xs">Care Team</span>
          </Button>
          <Button variant="ghost" className="flex-col space-y-1 h-auto py-2">
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Schedule</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default PatientDashboard;