
'use client';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from 'next-themes';

const translations = {
    en: {
        title: "Settings",
        subtitle: "Customize your app experience",
        notifications: "Notifications",
        notificationsDesc: "Manage how you receive alerts from KisanAI.",
        pushNotifications: "Push Notifications",
        emailNotifications: "Email Notifications",
        general: "General",
        language: "Language",
        appTheme: "App Theme",
        light: "Light",
        dark: "Dark",
        system: "System",
        helpSupport: "Help & Support",
        helpCenter: "Help Center",
        contactSupport: "Contact Support",
        privacyPolicy: "Privacy Policy",
    },
    hi: {
        title: "सेटिंग्स",
        subtitle: "अपने ऐप अनुभव को अनुकूलित करें",
        notifications: "सूचनाएं",
        notificationsDesc: "KisanAI से अलर्ट कैसे प्राप्त करें, यह प्रबंधित करें।",
        pushNotifications: "पुश सूचनाएं",
        emailNotifications: "ईमेल सूचनाएं",
        general: "सामान्य",
        language: "भाषा",
        appTheme: "ऐप थीम",
        light: "लाइट",
        dark: "डार्क",
        system: "सिस्टम",
        helpSupport: "सहायता और समर्थन",
        helpCenter: "सहायता केंद्र",
        contactSupport: "समर्थन से संपर्क करें",
        privacyPolicy: "गोपनीयता नीति",
    },
    mr: {
        title: "सेटिंग्ज",
        subtitle: "तुमचा ॲप अनुभव सानुकूलित करा",
        notifications: "सूचना",
        notificationsDesc: "तुम्ही KisanAI कडून सूचना कशा प्राप्त करता ते व्यवस्थापित करा.",
        pushNotifications: "पुश सूचना",
        emailNotifications: "ईमेल सूचना",
        general: "सामान्य",
        language: "भाषा",
        appTheme: "ॲप थीम",
        light: "लाइट",
        dark: "डार्क",
        system: "सिस्टम",
        helpSupport: "मदत आणि समर्थन",
        helpCenter: "मदत केंद्र",
        contactSupport: "समर्थनाशी संपर्क साधा",
        privacyPolicy: "गोपनीयता धोरण",
    }
}

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const t = translations[language];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{t.notifications}</CardTitle>
            <CardDescription>{t.notificationsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">{t.pushNotifications}</Label>
              <Switch id="push-notifications" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">{t.emailNotifications}</Label>
              <Switch id="email-notifications" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{t.general}</CardTitle>
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
              <Label htmlFor="app-theme">{t.appTheme}</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t.light}</SelectItem>
                  <SelectItem value="dark">{t.dark}</SelectItem>
                  <SelectItem value="system">{t.system}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
            <CardHeader>
                <CardTitle>{t.helpSupport}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Button variant="link" className="p-0 h-auto">{t.helpCenter}</Button><br/>
                <Button variant="link" className="p-0 h-auto">{t.contactSupport}</Button><br/>
                <Button variant="link" className="p-0 h-auto">{t.privacyPolicy}</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
