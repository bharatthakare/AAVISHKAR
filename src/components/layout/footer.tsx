
import Link from 'next/link';
import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                <Logo />
              <span className="font-headline">KisanAI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering Farmers with AI
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Tools</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/ai-tools" className="text-muted-foreground hover:text-foreground">AI Tools</Link></li>
              <li><Link href="/farm-planner" className="text-muted-foreground hover:text-foreground">Farm Planner</Link></li>
              <li><Link href="/market-prices" className="text-muted-foreground hover:text-foreground">Market Prices</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Resources</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/crop-advisory" className="text-muted-foreground hover:text-foreground">Crop Advisory</Link></li>
              <li><Link href="/community" className="text-muted-foreground hover:text-foreground">Community</Link></li>
              <li><Link href="/pests-diseases" className="text-muted-foreground hover:text-foreground">Pests & Diseases</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} KisanAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
