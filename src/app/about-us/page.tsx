
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Target, Tractor } from 'lucide-react';

const teamMembers = [
  {
    name: 'Dr. Alok Sharma',
    role: 'Founder & CEO',
    avatar: 'https://picsum.photos/seed/team1/200/200',
    bio: 'An agronomist with 20 years of experience, passionate about leveraging technology for agriculture.',
    hint: 'person portrait'
  },
  {
    name: 'Sunita Verma',
    role: 'Lead AI Engineer',
    avatar: 'https://picsum.photos/seed/team2/200/200',
    bio: 'Specializes in computer vision and machine learning models for crop science.',
    hint: 'person portrait'
  },
  {
    name: 'Rohan Gupta',
    role: 'Head of Product',
    avatar: 'https://picsum.photos/seed/team3/200/200',
    bio: 'Dedicated to creating intuitive and impactful tools that farmers love to use.',
    hint: 'person portrait'
  },
];

export default function AboutUsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="About KisanAI"
        subtitle="Empowering the future of agriculture, one farmer at a time."
      />

      <div className="max-w-4xl mx-auto space-y-12">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-primary" /> Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-muted-foreground">
            <p>
              Our mission is to bridge the technology gap in agriculture by
              providing accessible, data-driven, and AI-powered tools to
              farmers. We believe that by empowering farmers with actionable
              insights, we can help them increase yields, reduce costs, and
              practice sustainable farming.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tractor className="text-primary" /> Our Story
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              KisanAI was born from a simple observation: while technology was
              transforming industries, the agricultural sector, the backbone of
              our nation, was being left behind. Our founder, Dr. Alok Sharma,
              saw firsthand the challenges farmers faced—from unpredictable
              weather to pest infestations and market volatility.
            </p>
            <p>
              Driven by a desire to make a difference, he assembled a team of
              engineers, data scientists, and agricultural experts to build a
              platform that puts the power of artificial intelligence directly
              into the hands of farmers. KisanAI is the result of that vision.
            </p>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-3xl font-bold font-headline text-center mb-8">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.name} className="glass-card text-center">
                <CardContent className="pt-6">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.hint}/>
                    <AvatarFallback>
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold font-headline">
                    {member.name}
                  </h3>
                  <p className="text-primary font-semibold">{member.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
