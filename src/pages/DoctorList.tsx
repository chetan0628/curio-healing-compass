import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  Heart,
  MessageCircle,
  Video,
  Calendar,
  Award,
  GraduationCap,
  Users
} from 'lucide-react';

// Mock doctor data
const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    specialty: 'Wound Care Specialist',
    avatar: '👩‍⚕️',
    rating: 4.9,
    reviewCount: 127,
    location: 'San Francisco, CA',
    languages: ['English', 'Mandarin'],
    availability: 'Available Now',
    availabilityStatus: 'available',
    education: 'Harvard Medical School',
    experience: '12 years',
    about: 'Specializing in complex wound care and diabetic ulcer management with extensive experience in AI-assisted healing protocols.',
    certifications: ['Board Certified Wound Care', 'Diabetic Foot Specialist'],
    consultationFee: '$200',
    nextAvailable: 'Today 2:00 PM'
  },
  {
    id: 2,
    name: 'Dr. Michael Torres',
    specialty: 'Dermatologist',
    avatar: '👨‍⚕️',
    rating: 4.8,
    reviewCount: 89,
    location: 'Los Angeles, CA',
    languages: ['English', 'Spanish'],
    availability: 'Busy until 4 PM',
    availabilityStatus: 'busy',
    education: 'UCLA Medical Center',
    experience: '8 years',
    about: 'Expert in dermatological wound care, burns, and post-surgical healing with focus on aesthetic outcomes.',
    certifications: ['Board Certified Dermatology', 'Mohs Surgery'],
    consultationFee: '$250',
    nextAvailable: 'Today 4:30 PM'
  },
  {
    id: 3,
    name: 'Dr. Lisa Johnson',
    specialty: 'Plastic Surgeon',
    avatar: '👩‍⚕️',
    rating: 4.9,
    reviewCount: 156,
    location: 'New York, NY',
    languages: ['English', 'French'],
    availability: 'Available Now',
    availabilityStatus: 'available',
    education: 'Johns Hopkins University',
    experience: '15 years',
    about: 'Reconstructive surgery and advanced wound healing techniques with emphasis on scar reduction and tissue regeneration.',
    certifications: ['Board Certified Plastic Surgery', 'Reconstructive Surgery'],
    consultationFee: '$300',
    nextAvailable: 'Today 1:30 PM'
  },
  {
    id: 4,
    name: 'Dr. Robert Kim',
    specialty: 'Podiatrist',
    avatar: '👨‍⚕️',
    rating: 4.7,
    reviewCount: 92,
    location: 'Seattle, WA',
    languages: ['English', 'Korean'],
    availability: 'Available Tomorrow',
    availabilityStatus: 'scheduled',
    education: 'University of Washington',
    experience: '10 years',
    about: 'Specialized in diabetic foot care, wound prevention, and lower extremity healing protocols.',
    certifications: ['Board Certified Podiatry', 'Diabetic Foot Care'],
    consultationFee: '$180',
    nextAvailable: 'Tomorrow 9:00 AM'
  },
  {
    id: 5,
    name: 'Dr. Emily Watson',
    specialty: 'Vascular Surgeon',
    avatar: '👩‍⚕️',
    rating: 4.8,
    reviewCount: 78,
    location: 'Boston, MA',
    languages: ['English'],
    availability: 'Available Now',
    availabilityStatus: 'available',
    education: 'Massachusetts General Hospital',
    experience: '11 years',
    about: 'Vascular wound care specialist focusing on circulation-related healing complications and chronic wounds.',
    certifications: ['Board Certified Vascular Surgery', 'Wound Care Specialist'],
    consultationFee: '$275',
    nextAvailable: 'Today 3:15 PM'
  },
  {
    id: 6,
    name: 'Dr. James Rodriguez',
    specialty: 'Infectious Disease',
    avatar: '👨‍⚕️',
    rating: 4.9,
    reviewCount: 134,
    location: 'Miami, FL',
    languages: ['English', 'Spanish'],
    availability: 'Busy until 6 PM',
    availabilityStatus: 'busy',
    education: 'University of Miami',
    experience: '14 years',
    about: 'Expert in infection control, antibiotic therapy for wounds, and prevention of complications in healing processes.',
    certifications: ['Board Certified Infectious Disease', 'Hospital Infection Control'],
    consultationFee: '$220',
    nextAvailable: 'Today 6:30 PM'
  }
];

const specialties = ['All Specialties', 'Wound Care Specialist', 'Dermatologist', 'Plastic Surgeon', 'Podiatrist', 'Vascular Surgeon', 'Infectious Disease'];
const languages = ['All Languages', 'English', 'Spanish', 'Mandarin', 'French', 'Korean'];

const DoctorList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-healing-good';
      case 'busy': return 'text-healing-concern';
      case 'scheduled': return 'text-healing-moderate';
      default: return 'text-muted-foreground';
    }
  };

  const getAvailabilityBadgeVariant = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'busy': return 'secondary';
      case 'scheduled': return 'outline';
      default: return 'secondary';
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'All Specialties' || doctor.specialty === selectedSpecialty;
    const matchesLanguage = selectedLanguage === 'All Languages' || doctor.languages.includes(selectedLanguage);
    const matchesAvailability = availabilityFilter === 'all' || 
                               (availabilityFilter === 'available' && doctor.availabilityStatus === 'available') ||
                               (availabilityFilter === 'today' && (doctor.availabilityStatus === 'available' || doctor.nextAvailable.includes('Today')));
    
    return matchesSearch && matchesSpecialty && matchesLanguage && matchesAvailability;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-healing rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-primary">CURIO</span>
            </Link>
            <span className="text-muted-foreground ml-4 hidden sm:block">Find Your Specialist</span>
          </div>
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

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Connect with <span className="text-transparent bg-gradient-healing bg-clip-text">Expert Specialists</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find qualified healthcare providers specializing in wound care and healing optimization
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="medical-card mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search doctors, specialties, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(language => (
                    <SelectItem key={language} value={language}>{language}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                size="sm"
                variant={availabilityFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setAvailabilityFilter('all')}
              >
                All Doctors
              </Button>
              <Button
                size="sm"
                variant={availabilityFilter === 'available' ? 'default' : 'outline'}
                onClick={() => setAvailabilityFilter('available')}
                className="text-healing-good border-healing-good/20"
              >
                Available Now
              </Button>
              <Button
                size="sm"
                variant={availabilityFilter === 'today' ? 'default' : 'outline'}
                onClick={() => setAvailabilityFilter('today')}
              >
                Available Today
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Found {filteredDoctors.length} specialists matching your criteria
          </p>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sort by relevance</span>
          </div>
        </div>

        {/* Doctor Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="medical-card-elevated hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{doctor.avatar}</div>
                    <div>
                      <CardTitle className="text-xl">{doctor.name}</CardTitle>
                      <CardDescription className="text-lg font-medium text-primary">
                        {doctor.specialty}
                      </CardDescription>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="font-medium">{doctor.rating}</span>
                          <span className="text-muted-foreground">({doctor.reviewCount})</span>
                        </div>
                        <Badge variant={getAvailabilityBadgeVariant(doctor.availabilityStatus)}>
                          {doctor.availability}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{doctor.consultationFee}</p>
                    <p className="text-sm text-muted-foreground">consultation</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{doctor.about}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{doctor.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className={getAvailabilityColor(doctor.availabilityStatus)}>
                      {doctor.nextAvailable}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span>{doctor.education}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span>{doctor.experience} experience</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Languages:</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.languages.map(lang => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Certifications:</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.certifications.map(cert => (
                      <Badge key={cert} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
                  <Button 
                    size="sm" 
                    className="gradient-healing text-white hover:opacity-90"
                    disabled={doctor.availabilityStatus !== 'available'}
                  >
                    <Video className="w-4 h-4 mr-1" />
                    Video
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="w-4 h-4 mr-1" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredDoctors.length === 0 && (
          <Card className="medical-card text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No specialists found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or filters to find more specialists.
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('All Specialties');
                setSelectedLanguage('All Languages');
                setAvailabilityFilter('all');
              }}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CTA Section */}
      <section className="bg-muted/30 py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Start Your Healing Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with top-rated specialists and get personalized wound care guidance powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/patient/login">
              <Button size="lg" className="gradient-healing text-white hover:opacity-90">
                Create Patient Account
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline">
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorList;