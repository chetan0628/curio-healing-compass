import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Search,
  Filter,
  Video,
  MessageCircle,
  FileText,
  Heart,
  Bell,
  LogOut,
  Eye,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Line } from 'recharts';
import { LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

// Mock patient data
const patients = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    lastPhoto: '2024-01-29', 
    riskLevel: 'low', 
    healingScore: 85,
    condition: 'Post-surgical wound',
    daysActive: 15
  },
  { 
    id: 2, 
    name: 'Michael Chen', 
    lastPhoto: '2024-01-28', 
    riskLevel: 'high', 
    healingScore: 35,
    condition: 'Diabetic ulcer',
    daysActive: 8
  },
  { 
    id: 3, 
    name: 'Emma Rodriguez', 
    lastPhoto: '2024-01-29', 
    riskLevel: 'moderate', 
    healingScore: 62,
    condition: 'Pressure ulcer',
    daysActive: 22
  },
  { 
    id: 4, 
    name: 'David Park', 
    lastPhoto: '2024-01-27', 
    riskLevel: 'low', 
    healingScore: 78,
    condition: 'Burn recovery',
    daysActive: 12
  },
];

const mockHealingData = [
  { date: '2024-01-01', score: 25 },
  { date: '2024-01-08', score: 35 },
  { date: '2024-01-15', score: 50 },
  { date: '2024-01-22', score: 68 },
  { date: '2024-01-29', score: 85 },
];

const DoctorDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(patients[0]);
  const [filterRisk, setFilterRisk] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  const toggleDarkMode = (enabled: boolean) => {
    setIsDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'healing-good';
      case 'moderate': return 'healing-moderate';
      case 'high': return 'healing-critical';
      default: return 'healing-good';
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'low': return 'default';
      case 'moderate': return 'secondary';
      case 'high': return 'destructive';
      default: return 'default';
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRisk === 'all' || patient.riskLevel === filterRisk;
    return matchesSearch && matchesFilter;
  });

  const redAlerts = patients.filter(p => p.riskLevel === 'high').length;
  const yellowAlerts = patients.filter(p => p.riskLevel === 'moderate').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
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
              <p className="text-sm font-medium">Dr. Maria Santos</p>
              <p className="text-xs text-muted-foreground">Wound Care Specialist</p>
            </div>
            <Link to="/doctor/login">
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </Link>
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
                      variant={filterRisk === 'high' ? 'destructive' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setFilterRisk(filterRisk === 'high' ? 'all' : 'high')}
                    >
                      Show Red Alerts Only
                    </Button>
                    <Button
                      variant={filterRisk === 'moderate' ? 'secondary' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setFilterRisk(filterRisk === 'moderate' ? 'all' : 'moderate')}
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                      onClick={() => setSelectedPatient(patient)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedPatient?.id === patient.id 
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
                            <span>Last photo: {new Date(patient.lastPhoto).toLocaleDateString()}</span>
                            <span className="font-medium text-primary">{patient.healingScore}% healed</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {patient.daysActive} days active
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
            {selectedPatient && (
              <div className="space-y-6">
                {/* Patient Overview */}
                <Card className="medical-card-elevated">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{selectedPatient.name}</CardTitle>
                        <CardDescription>{selectedPatient.condition}</CardDescription>
                      </div>
                      <Badge 
                        className={`${getRiskColor(selectedPatient.riskLevel)} text-white text-lg px-4 py-2`}
                      >
                        {selectedPatient.healingScore}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Risk Level:</span>
                        <Badge variant={getRiskBadgeVariant(selectedPatient.riskLevel)}>
                          {selectedPatient.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Last Photo:</span>
                        <span className="font-medium">
                          {new Date(selectedPatient.lastPhoto).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Monitoring Days:</span>
                        <span className="font-medium">{selectedPatient.daysActive} days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Healing Progress Chart */}
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
                        <LineChart data={mockHealingData}>
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

                {/* Action Buttons */}
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
    </div>
  );
};

export default DoctorDashboard;