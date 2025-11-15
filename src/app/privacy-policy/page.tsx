
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Privacy Policy"
        subtitle="Your privacy is important to us."
      />

      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              We collect information to provide better services to all our
              users. The types of information we collect include:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Personal Information:</strong> When you sign up for
                KisanAI, we may ask for personal information, like your name,
                email address, telephone number, or location.
              </li>
              <li>
                <strong>Farm Data:</strong> Information you provide about your
                farm, including crop type, soil data, and acreage.
              </li>
              <li>
                <strong>Usage Information:</strong> We collect information about
                the services that you use and how you use them, like when you
                use the disease detector or check market prices.
              </li>
              <li>
                <strong>Device Information:</strong> We may collect
                device-specific information (such as your hardware model and
                operating system version).
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>2. How We Use Information</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Provide, maintain, and improve our services, including the AI
                models.
              </li>
              <li>
                Develop new services and features.
              </li>
              <li>
                Provide you with personalized content, such as custom crop
                advisories.
              </li>
              <li>
                Communicate with you about your account or our services.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>3. Information Sharing</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              We do not share personal information with companies,
              organizations, and individuals outside of KisanAI unless one of
              the following circumstances applies:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>With your consent:</strong> We will share personal
                information with companies, organizations or individuals
                outside of KisanAI when we have your consent to do so.
              </li>
              <li>
                <strong>For legal reasons:</strong> We will share personal
                information if we have a good-faith belief that access, use,
                preservation or disclosure of the information is reasonably
                necessary.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
