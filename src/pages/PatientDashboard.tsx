import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  LogOut
} from 'lucide-react';
import { Line } from 'recharts';
import { LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';

// Mock data for healing progress
const healingData = [
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
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null);
  const currentScore = 85;
  const riskLevel = 'low';
  const streak = 10;

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
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

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
            <Button size="lg" className="gradient-healing text-white hover:opacity-90 text-lg px-8">
              Take Photo Now
            </Button>
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