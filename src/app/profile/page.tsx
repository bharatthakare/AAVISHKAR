
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { User } from 'lucide-react';

export default function ProfilePage() {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    name: 'Ramesh Kumar',
    location: 'Bhopal, Madhya Pradesh',
    phone: '+91-9876543210',
    email: 'ramesh@example.com',
    avatar: 'https://picsum.photos/seed/farmer_profile/200/200',
    farmName: 'Kumar Agro Farm',
    farmSize: '15',
    mainCrop: 'Soybean',
    language: 'en',
    darkMode: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSwitchChange = (id: string, checked: boolean) => {
    setProfileData((prev) => ({ ...prev, [id]: checked }));
  };

  const handleSaveChanges = () => {
    // In a real app, you would send this data to your backend.
    console.log('Saving profile data:', profileData);
    toast({
      title: 'Profile Updated',
      description: 'Your changes have been saved successfully.',
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader title="My Profile" subtitle="Manage your account and farm details" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="glass-card text-center p-8">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={profileData.avatar} data-ai-hint="person portrait" />
              <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold font-headline">{profileData.name}</h2>
            <p className="text-muted-foreground">{profileData.location}</p>
            <Button variant="outline" className="mt-4">Change Photo</Button>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>User Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={profileData.name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={profileData.phone} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={profileData.email} onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8 glass-card">
            <CardHeader>
              <CardTitle>Farm Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="farmName">Farm Name</Label>
                  <Input id="farmName" value={profileData.farmName} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="farmSize">Farm Size (acres)</Label>
                        <Input id="farmSize" type="number" value={profileData.farmSize} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mainCrop">Main Crop</Label>
                        <Input id="mainCrop" value={profileData.mainCrop} onChange={handleInputChange} />
                    </div>
                </div>
            </CardContent>
          </Card>
          
          <Card className="mt-8 glass-card">
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="language">Language</Label>
                    <Select value={profileData.language} onValueChange={(value) => handleSelectChange('language', value)}>
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">हिन्दी</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <Separator />
                 <div className="flex items-center justify-between">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <Switch id="darkMode" checked={profileData.darkMode} onCheckedChange={(checked) => handleSwitchChange('darkMode', checked)} />
                 </div>
                 <Button className="w-full mt-4" onClick={handleSaveChanges}>Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
