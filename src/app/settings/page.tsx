import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader title="Settings" subtitle="Customize your app experience" />
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Manage how you receive alerts from KisanAI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch id="push-notifications" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch id="email-notifications" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en">
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
              <Label htmlFor="app-theme">App Theme</Label>
              <Select defaultValue="light">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-lg">
            <CardHeader>
                <CardTitle>Help & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Button variant="link" className="p-0 h-auto">Help Center</Button><br/>
                <Button variant="link" className="p-0 h-auto">Contact Support</Button><br/>
                <Button variant="link" className="p-0 h-auto">Privacy Policy</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
