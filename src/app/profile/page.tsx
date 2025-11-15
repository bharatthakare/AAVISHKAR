
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
import { useLanguage } from '@/hooks/use-language';

const translations = {
    en: {
        title: "My Profile",
        subtitle: "Manage your account and farm details",
        changePhoto: "Change Photo",
        userDetails: "User Details",
        fullName: "Full Name",
        phoneNumber: "Phone Number",
        emailAddress: "Email Address",
        location: "Location",
        state: "State",
        district: "District",
        cityVillage: "City/Village",
        farmDetails: "Farm Details",
        farmName: "Farm Name",
        farmSize: "Farm Size (acres)",
        mainCrop: "Main Crop",
        preferences: "Preferences",
        language: "Language",
        darkMode: "Dark Mode",
        saveChanges: "Save Changes",
        toastTitle: "Profile Updated",
        toastDescription: "Your changes have been saved successfully.",
    },
    hi: {
        title: "मेरी प्रोफ़ाइल",
        subtitle: "अपने खाते और खेत का विवरण प्रबंधित करें",
        changePhoto: "फोटो बदलें",
        userDetails: "उपयोगकर्ता विवरण",
        fullName: "पूरा नाम",
        phoneNumber: "फ़ोन नंबर",
        emailAddress: "ईमेल पता",
        location: "स्थान",
        state: "राज्य",
        district: "जिला",
        cityVillage: "शहर/गांव",
        farmDetails: "खेत का विवरण",
        farmName: "खेत का नाम",
        farmSize: "खेत का आकार (एकड़ में)",
        mainCrop: "मुख्य फसल",
        preferences: "वरीयताएँ",
        language: "भाषा",
        darkMode: "डार्क मोड",
        saveChanges: "बदलाव सहेजें",
        toastTitle: "प्रोफ़ाइल अपडेट की गई",
        toastDescription: " आपके परिवर्तन सफलतापूर्वक सहेज लिए गए हैं।",
    },
    mr: {
        title: "माझी प्रोफाइल",
        subtitle: "तुमचे खाते आणि शेती तपशील व्यवस्थापित करा",
        changePhoto: "फोटो बदला",
        userDetails: "वापरकर्ता तपशील",
        fullName: "पूर्ण नाव",
        phoneNumber: "फोन नंबर",
        emailAddress: "ईमेल पत्ता",
        location: "स्थान",
        state: "राज्य",
        district: "जिल्हा",
        cityVillage: "शहर/गाव",
        farmDetails: "शेती तपशील",
        farmName: "शेताचे नाव",
        farmSize: "शेताचा आकार (एकर मध्ये)",
        mainCrop: "मुख्य पीक",
        preferences: " प्राधान्ये",
        language: "भाषा",
        darkMode: "डार्क मोड",
        saveChanges: "बदल जतन करा",
        toastTitle: "प्रोफाइल अपडेट केली",
        toastDescription: "तुमचे बदल यशस्वीरित्या जतन केले आहेत.",
    }
};


export default function ProfilePage() {
  const { toast } = useToast();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const [profileData, setProfileData] = useState({
    name: 'Ramesh Kumar',
    state: 'Maharashtra',
    district: 'Washim',
    cityVillage: 'Washim',
    phone: '+91-9876543210',
    email: 'ramesh@example.com',
    avatar: 'https://picsum.photos/seed/farmer_profile/200/200',
    farmName: 'Kumar Agro Farm',
    farmSize: '15',
    mainCrop: 'Soybean',
    darkMode: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSwitchChange = (id: string, checked: boolean) => {
    setProfileData((prev) => ({ ...prev, [id]: checked }));
  };

  const handleSaveChanges = () => {
    // In a real app, you would send this data to your backend.
    console.log('Saving profile data:', profileData);
    toast({
      title: t.toastTitle,
      description: t.toastDescription,
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="glass-card text-center p-8">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={profileData.avatar} data-ai-hint="person portrait" />
              <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold font-headline">{profileData.name}</h2>
            <p className="text-muted-foreground">{`${profileData.cityVillage}, ${profileData.state}`}</p>
            <Button variant="outline" className="mt-4">{t.changePhoto}</Button>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t.userDetails}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.fullName}</Label>
                  <Input id="name" value={profileData.name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.phoneNumber}</Label>
                  <Input id="phone" value={profileData.phone} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t.emailAddress}</Label>
                <Input id="email" type="email" value={profileData.email} onChange={handleInputChange} />
              </div>
              <Separator />
               <div className="space-y-2">
                 <Label>{t.location}</Label>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input id="state" placeholder={t.state} value={profileData.state} onChange={handleInputChange} />
                    <Input id="district" placeholder={t.district} value={profileData.district} onChange={handleInputChange} />
                    <Input id="cityVillage" placeholder={t.cityVillage} value={profileData.cityVillage} onChange={handleInputChange} />
                 </div>
               </div>
            </CardContent>
          </Card>

          <Card className="mt-8 glass-card">
            <CardHeader>
              <CardTitle>{t.farmDetails}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="farmName">{t.farmName}</Label>
                  <Input id="farmName" value={profileData.farmName} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="farmSize">{t.farmSize}</Label>
                        <Input id="farmSize" type="number" value={profileData.farmSize} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mainCrop">{t.mainCrop}</Label>
                        <Input id="mainCrop" value={profileData.mainCrop} onChange={handleInputChange} />
                    </div>
                </div>
            </CardContent>
          </Card>
          
          <Card className="mt-8 glass-card">
            <CardHeader>
                <CardTitle>{t.preferences}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="language">{t.language}</Label>
                    <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'hi' | 'mr')}>
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">हिन्दी</SelectItem>
                            <SelectItem value="mr">मराठी</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <Separator />
                 <div className="flex items-center justify-between">
                    <Label htmlFor="darkMode">{t.darkMode}</Label>
                    <Switch id="darkMode" checked={profileData.darkMode} onCheckedChange={(checked) => handleSwitchChange('darkMode', checked)} />
                 </div>
                 <Button className="w-full mt-4" onClick={handleSaveChanges}>{t.saveChanges}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
