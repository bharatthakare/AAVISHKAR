
'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Message Sent!',
      description: 'Thank you for contacting us. We will get back to you shortly.',
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out with any questions or feedback."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your Name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message..."
                    rows={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Our Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 mt-1 text-primary" />
                <p>
                  KisanAI Headquarters,
                  <br />
                  Washim, Maharashtra,
                  <br />
                  India 444505
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-primary" />
                <a
                  href="mailto:contact@kisanai.com"
                  className="hover:text-primary"
                >
                  contact@kisanai.com
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-primary" />
                <a href="tel:+911234567890" className="hover:text-primary">
                  +91-123-456-7890
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

