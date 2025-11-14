import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader title="My Profile" subtitle="Manage your account and farm details" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="glass-card text-center p-8">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src="https://picsum.photos/seed/farmer_profile/200/200" data-ai-hint="person portrait" />
              <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold font-headline">Ramesh Kumar</h2>
            <p className="text-muted-foreground">Bhopal, Madhya Pradesh</p>
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
                  <Input id="name" defaultValue="Ramesh Kumar" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+91-9876543210" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="ramesh@example.com" />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8 glass-card">
            <CardHeader>
              <CardTitle>Farm Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="farm-name">Farm Name</Label>
                  <Input id="farm-name" defaultValue="Kumar Agro Farm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="farm-size">Farm Size (acres)</Label>
                        <Input id="farm-size" type="number" defaultValue="15" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="main-crop">Main Crop</Label>
                        <Input id="main-crop" defaultValue="Soybean" />
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
                    <Select defaultValue="en">
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
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <Switch id="dark-mode" />
                 </div>
                 <Button className="w-full mt-4">Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
